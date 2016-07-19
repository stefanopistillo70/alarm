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
	
	var device  = req.body.device;
	logger.info('Create Device :'+device.id);
	
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
											logger.error("Error Create Device: ");
											logger.error(err.errors);
											res.status(400).send(new Response().error(400,err.errors));;
										}else {
											logger.info('Device Creation OK.');
											res.json(new Response("Device Created"));
										}
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
		logger.info('Update Device : '+device.id);
		
		var query = { '_id' : device._id};
		var update = "";
		if (device.batteryLevel){
			update = { 'batteryLevel' : device.batteryLevel };
			query = { 'id' : device.id};
		} else{
			 update = { 'name' : device.name, 'deviceType' : device.deviceType };
			 query = { '_id' : device._id};
		}
		var opts = { strict: true, runValidators: true };
		Device.update(query, update, opts, function(err,raw) {
			if (err){
				logger.error("Error Update Device: ");
				logger.error(err.errors);
				res.status(400).send(new Response().error(400,err.errors));
			}else{
				logger.info('Update Device OK.');
				res.json(new Response("Device Updated"));
			} 		  
		});			
});


router.post('/:deviceId/sensor/:id', function(req, res, next) {
		var deviceId = req.body.deviceId;
		var sensor = req.body.sensor;
		if(sensor == undefined){
			res.status(400).send(new Response().error(400,"sensor is undefined"));
			return;
		}
		logger.info('Add Sensor '+sensor.id+' to Device : '+deviceId);
		
		var query = { 'id' : deviceId}
		var updates = { $push: {sensors: sensor}};
		var opts = { runValidators: true };
		Device.findOneAndUpdate(query, updates, opts, function(err, device) {
			if (err){ 
				logger.error("Error Add Sensor: ");
				logger.error(err.errors);
				res.status(400).send(new Response().error(400,err.errors));
			}else if(device == undefined ){
				logger.error("Error Add Sensor: No update record done");
				res.status(400).send(new Response().error(400,"No update record done"));
			}else{
				logger.info('Add Sensor OK.');
				res.json(new Response(device));
			}
		})	
});


router.put('/:deviceId/sensor/:id', function(req, res, next) {
		var deviceId = req.params.deviceId;
		var sensor = req.body.sensor;

		if(sensor == undefined){
			res.status(400).send(new Response().error(400,"sensor is undefined"));
			return;
		}
		
		logger.info('Update Sensor value '+sensor.id+' to Device : '+deviceId);
		
		var query = { 'id' : deviceId, 'sensors.id' : sensor.id};
		var updates = {'$set':  {'sensors.$.value': sensor.value }};
		var opts = { runValidators: true };
		Device.findOneAndUpdate(query, updates, opts, function(err, device) {
			if (err){ 
				logger.error("Error Update Sensor value : ");
				logger.error(err.errors);
				res.status(400).send(new Response().error(400,err.errors));
			}else if(device === undefined ){
				logger.error("Error Update Sensor value : No update record done");
				res.status(400).send(new Response().error(400,"No update record done"));
			}else{
				logger.info('Update Sensor OK.');
				res.json(new Response(device));
			}
		})	
});



router.delete('/:id', function(req, res, next) {
		
		logger.info('Delete Device with ID -> '+req.params.id)
		
		Device.remove({ _id: req.params.id }, function(error,raw) {
			if (error) {
				res.status(400).send(new Response().error(400,err.errors));
			} else {
				logger.info('Delete Device OK.');
				res.json(new Response("Device Removed"));	
			}
		});
		
});


module.exports = router;
