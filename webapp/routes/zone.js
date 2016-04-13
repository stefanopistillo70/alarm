var express = require('express');
var router = express.Router();

var Zone = require('../models/zone');
var Response = require('./response');

/* GET Device listing. */
router.get('/', function(req, res, next) {
	Device.find({}, function(err, devices) {
				if (err){
					res.status(400).send(err);
				}else res.json(new Response(devices));
	});	
});

/* create Zone. */
router.post('/', function(req, res, next) {
	console.log(req.body);
	
	var zone = new Zone();

	zone.name = req.body.name;
		
	zone.save(function(err) {
		if (err){
			res.status(400).send(new Response().error(400,err.errors));;
		}else res.json({ message: 'Zone created!' });
	});
		
});


router.get('/:id', function(req, res, next) {
	console.log('ID -> '+req.params.id)
	Zone.find({}, function(err, eventLogs) {
				if (err){
					res.status(400).send(new Response().error(400,err.errors));
				}else res.json(eventLogs);
	});	
});


router.put('/:id', function(req, res, next) {
		
		console.log(req.body);
		
		var zone = new Zone();
		
		zone.id = req.body.id;
		
		zone.save(function(err) {
            if (err){
				res.status(400).send(new Response().error(400,err.errors));
			}else res.json({ message: 'Device created!' });
        });
});




module.exports = router;
