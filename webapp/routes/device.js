var express = require('express');
var router = express.Router();

var Device = require('../domain/device');
var Config = require('../domain/config');
var Response = require('./response');

/* GET Device listing. */
router.get('/', function(req, res, next) {
	Device.find({}, function(err, devices) {
				if (err){
					res.status(400).send(err);
				}else res.json(new Response(devices));
	});	
});

/* create Device. */
router.post('/', function(req, res, next) {
	console.log(req.body);
	
	Config.find({}, function(err, result) {
				if (err){
					res.status(400).send(new Response().error(400,err.errors));;
				}else{
					if((result != undefined) && (result.length > 0)){
						
					}else{res.status(400).send(err);}
				} 
			});
	
	var device = new Device();
	
	device.id = req.body.id;
	device.name = req.body.name;
	device.deviceType = req.body.deviceType;
	device.technology = req.body.technology;
		
	device.save(function(err) {
		if (err){
			res.status(400).send(new Response().error(400,err.errors));;
		}else res.json({ message: 'Device created!' });
	});
		
});


router.get('/:id', function(req, res, next) {
	console.log('ID -> '+req.params.id)
	Device.find({}, function(err, eventLogs) {
				if (err){
					res.status(400).send(new Response().error(400,err.errors));
				}else res.json(eventLogs);
	});	
});


router.put('/:id', function(req, res, next) {
		
		console.log(req.body);
		
		var device = new Device();
		
		device.id = req.body.id;
		
		device.save(function(err) {
            if (err){
				res.status(400).send(new Response().error(400,err.errors));
			}else res.json({ message: 'Device created!' });
        });
});




module.exports = router;
