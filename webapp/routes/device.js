var express = require('express');
var router = express.Router();

var logger = require('../config/logger.js')('Device');
var Device = require('../models/device');
var Location = require('../models/location');
var Response = require('./response');

/* GET Device listing. */
router.get('/', function(req, res, next) {
	
	var locations = req.locations.split("#");
	query = { locationId : { $in: locations }};
	
	Device.find(query, function(err, devices) {
				if (err){
					res.status(400).send(err);
				}else res.json(new Response(devices));
	});	
});

/* create Device. */
router.post('/', function(req, res, next) {
	
	console.log(req.locations);
	var device  = req.body.device;
	console.log(device);
	
	
	var locations = req.locations.split("#");
	if(locations.length > 1) res.status(400).send(new Response().error(400,"More than one location specified"));
	else{

		query = { _id :  locations[0]}
		Location.find(query, function(err, locations) {
					if (err){
						res.status(400).send(new Response().error(400,err.errors));
					}else{
						if((locations != undefined) && (locations.length > 0)){
							if(locations[0].config.enableNewDevice){
								
									var dbDevice = new Device();
		
									dbDevice.id = device.id;
									dbDevice.name = device.name;
									dbDevice.deviceType = device.deviceType;
									dbDevice.technology = device.technology;
									dbDevice.locationId = locations[0]._id;
										
									dbDevice.save(function(err) {
										if (err){
											res.status(400).send(new Response().error(400,err.errors));;
										}else res.json(new Response("Device Created"));
									});
								
							}
							else res.status(400).send(new Response().error(400,"enableNewDevice is false"));
						}else{ res.status(400).send(new Response().error(400,"No Location found...")); }
					} 
				});
			
	};
		
});


router.get('/:id', function(req, res, next) {
	logger.info('ID -> '+req.params.id)
	//TODO
	Device.find({}, function(err, eventLogs) {
				if (err){
					res.status(400).send(new Response().error(400,err.errors));
				}else res.json(eventLogs);
	});	
});


router.put('/:id', function(req, res, next) {
		
		var device = req.body;
		
		var query = { '_id' : device._id}
		var update = { 'name' : device.name, 'deviceType' : device.deviceType };
		var opts = { strict: true, runValidators: true };
		Device.update(query, update, opts, function(err,raw) {
			if (err){
				res.status(400).send(new Response().error(400,err.errors));
			}else{
				res.json(new Response("Device Updated"));
			} 		  
		});			
});


router.post('/sensor', function(req, res, next) {
		var deviceId = req.body.deviceId;
		var sensor = req.body.sensor;
		if(sensor == undefined){
			res.status(400).send(new Response().error(400,"sensor is undefined"));
			return;
		}
		
		var query = { 'id' : deviceId}
		var updates = { $push: {sensors: sensor}};
		var opts = { runValidators: true };
		Device.findOneAndUpdate(query, updates, opts, function(err, device) {
			if (err) res.status(400).send(new Response().error(400,err.errors));
			else if(device === undefined ){
				res.status(400).send(new Response().error(400,"No update record done"));
			}else{
				res.json(new Response(device));
			}
		})	
});


router.delete('/:id', function(req, res, next) {
		
		logger.info('ID -> '+req.params.id)
		
		Device.remove({ _id: req.params.id }, function(error,raw) {
			if (error) {
				res.status(400).send(new Response().error(400,err.errors));
			} else {
				res.json(new Response("Device Removed"));	
			}
		});
		
});


module.exports = router;
