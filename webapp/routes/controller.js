
var logger = require('../config/logger.js')('Controller');
var Response = require('./response');
var Location       = require('../models/location');

var express = require('express');
var router = express.Router();


//check for updates
router.get('/', function(req, res, next) {
		
	var locationId = req.locations;
	
	var query = { '_id' : locationId }
	var updates = { 'controller.lastCheck' : new Date(), 'config.hasNewUpdates' : false}
	Location.findOneAndUpdate(query, updates, function(err, location) {
		if (err){
			return res.status(403).send(new Response().error(400,err.errors));
		}else{
			if (location) {
				
				logger.info("Location Found controllerId ->"+location.controller.controllerId);
				logger.info("hasNewUpdates "+location.config.hasNewUpdates);
				var resp = { hasNewUpdates : location.config.hasNewUpdates};
				res.json(new Response(resp));
				
			}else{
				logger.error("Authentication Problem: no location found");
				return res.status(403).send(new Response().error(400,"Error: no location found"));
			}
		}
	});

});



module.exports = router;




