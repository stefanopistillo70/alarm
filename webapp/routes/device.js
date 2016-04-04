var express = require('express');
var router = express.Router();

var Device = require('../domain/device');

/* GET Device listing. */
router.get('/', function(req, res, next) {
	Device.find({}, function(err, eventLogs) {
				if (err){
					res.status(400).send(err);
				}else res.json(eventLogs);
	});	
});

/* create Device. */
router.post('/', function(req, res, next) {
	console.log(req.body);
	
	var device = new Device();
	
	device.id = req.body.id;
	device.name = req.body.name;
	device.deviceType = req.body.deviceType;
	device.technology = req.body.technology;
		
	device.save(function(err) {
		if (err){
			res.status(400).send(err);
		}else res.json({ message: 'Device created!' });
	});
		
});


router.get('/:id', function(req, res, next) {
	console.log('ID -> '+req.params.id)
	Device.find({}, function(err, eventLogs) {
				if (err){
					res.status(400).send(err);
				}else res.json(eventLogs);
	});	
});


router.put('/:id', function(req, res, next) {
		
		console.log(req.body);
		
		var device = new Device();
		
		device.id = req.body.id;
		
		device.save(function(err) {
            if (err){
				res.status(400).send(err);
			}else res.json({ message: 'Device created!' });
        });
});




module.exports = router;
