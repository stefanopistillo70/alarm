var express = require('express');
var router = express.Router();

var Zone = require('../models/zone');
var Response = require('./response');
var userLogic = require('../logic/userLogic');

/* GET Zone listing. */
router.get('/', function(req, res, next) {
	var locations = req.locations.split("#");
	query = { locationId : { $in: locations }};
	
	Zone.find(query, function(err, devices) {
				if (err){
					res.status(400).send(err);
				}else res.json(new Response(devices));
	});	
});

/* create Zone. */
router.post('/', function(req, res, next) {
	
	var locations = req.locations.split("#");
	if(locations.length > 1) res.status(400).send(new Response().error(400,"More than one location specified"));
	else{
	
		var zone = new Zone();

		zone.name = req.body.name;
		zone.armed = req.body.armed;
		zone.devices = req.body.devices;
		zone.locationId = locations[0];
			
		zone.save(function(err) {
			if (err){
				res.status(400).send(new Response().error(400,err.errors));
			}else{
				userLogic.userUpdateHasNewUpdates(zone.locationId, true);
				res.json(new Response("Zone Created"));
			} 
		});
	}
		
});


router.get('/:id', function(req, res, next) {
	console.log('ID -> '+req.params.id)
	//TODO
	Zone.find({}, function(err, eventLogs) {
		if (err){
			res.status(400).send(new Response().error(400,err.errors));
		}else res.json(eventLogs);
	});	
});

//update Zone
router.put('/:id', function(req, res, next) {
		
		var zone = req.body;
		
		var locations = req.locations.split("#");
		if(locations.length > 1) res.status(400).send(new Response().error(400,"More than one location specified"));
		else{
			var query = { '_id' : zone._id}
			var update = { 'name' : zone.name, 'armed' : zone.armed, 'devices' : zone.devices };
			var opts = { strict: true };
			Zone.update(query, update, opts, function(error,raw) {
				if (error){
					res.status(400).send(new Response().error(400,err.errors));
				}else{
					userLogic.userUpdateHasNewUpdates(locations[0], true);
					res.json(new Response("Zone Updated"));
				} 		  
			});			
		}
});


//delete Zone
router.delete('/:id', function(req, res, next) {
		
		console.log('ID -> '+req.params.id)
		var locations = req.locations.split("#");
		if(locations.length > 1) res.status(400).send(new Response().error(400,"More than one location specified"));
		else{
			Zone.remove({ _id: req.params.id }, function(error,raw) {
				if (error) {
					res.status(400).send(new Response().error(400,err.errors));
				} else {
					userLogic.userUpdateHasNewUpdates(locations[0], true);
					res.json(new Response("Zone Removed"));	
				}
			});
		}
});


module.exports = router;
