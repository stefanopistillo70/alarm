
var logger = require('../config/logger.js')('Web');
var Response = require('./response');
var Location       = require('../models/location');

var express = require('express');
var router = express.Router();


//check for updates
router.get('/', function(req, res, next) {
		
	var locationId = req.locations;
	
	var query = { '_id' : locationId }
	Location.findOne(query, function(err, location) {
		if (err){
			return res.status(403).send(new Response().error(400,err.errors));
		}	

		if (location) {
			
			logger.info("Location Found token ->"+location.controller.controllerId);

			res.json(new Response(location.config.hasNewUpdates));
			
		}else{
			logger.error("Authentication Problem: no location found");
			return res.status(403).send(new Response().error(400,"Error: no location found"));
		}
	});

});



module.exports = router;




