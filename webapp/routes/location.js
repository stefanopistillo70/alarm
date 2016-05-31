var express = require('express');
var router = express.Router();

var Location = require('../models/location');
var Response = require('./response');

/* GET Location listing. */
router.get('/', function(req, res, next) {
	var locations = req.locations.split("#");
	query = { locationId : { $in: locations }};
	
	Location.find(query, function(err, devices) {
				if (err){
					res.status(400).send(err);
				}else res.json(new Response(devices));
	});	
});


//update Location
router.put('/:id', function(req, res, next) {
		
		var config = req.body;
		
		var locations = req.locations.split("#");
		if(locations.length > 1) res.status(400).send(new Response().error(400,"More than one location specified"));
		else{
			var query = { '_id' : locations[0]}
			var update = { 'config.enableNewDevice' : config.enableNewDevice };
			var opts = { strict: true };
			Location.update(query, update, opts, function(error,raw) {
				if (error){
					res.status(400).send(new Response().error(400,err.errors));
				}else{
					res.json(new Response("Location Updated"));
				} 		  
			});			
		}
});


module.exports = router;
