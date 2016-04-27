var express = require('express');
var router = express.Router();

var Device = require('../models/device');
var Config = require('../models/config');
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
	console.log(req.body);
	
	Config.find({}, function(err, configs) {
				if (err){
					res.status(400).send(new Response().error(400,err.errors));
				}else{
					if((configs != undefined) && (configs.length > 0)){
						if(configs[0].enableNewDevice){
							
								var device = new Device();
	
								device.id = req.body.id;
								device.name = req.body.name;
								device.deviceType = req.body.deviceType;
								device.technology = req.body.technology;
									
								device.save(function(err) {
									if (err){
										res.status(400).send(new Response().error(400,err.errors));;
									}else res.json(new Response("Device Created"));
								});
							
						}
						else res.status(400).send(new Response().error(400,"enableNewDevice is false"));
					}else{ res.status(400).send(new Response().error(400,"No Config found...")); }
				} 
			});
		
});


router.get('/:id', function(req, res, next) {
	console.log('ID -> '+req.params.id)
	//TODO
	Device.find({}, function(err, eventLogs) {
				if (err){
					res.status(400).send(new Response().error(400,err.errors));
				}else res.json(eventLogs);
	});	
});


router.put('/:id', function(req, res, next) {
		
		console.log(req.body);
		
		var device = req.body;
		
		var query = { '_id' : device._id}
		var update = { 'name' : device.name, 'deviceType' : device.deviceType };
		var opts = { strict: true };
		Device.update(query, update, opts, function(error,raw) {
			if (error){
				res.status(400).send(new Response().error(400,err.errors));
			}else{
				console.log(raw);
				res.json(new Response("Device Updated"));
			} 		  
		});			
});



router.delete('/:id', function(req, res, next) {
		
		console.log('ID -> '+req.params.id)
		
		Device.remove({ _id: req.params.id }, function(error,raw) {
			if (error) {
				res.status(400).send(new Response().error(400,err.errors));
			} else {
				console.log(raw);
				res.json(new Response("Device Removed"));	
			}
		});
		
});






module.exports = router;
