var express = require('express');
var router = express.Router();

var EventLog = require('../models/eventLog');
var Device = require('../models/device');
var Response = require('./response');
var userLogic = require('../logic/userLogic');

/* GET EventLog listing. */
router.get('/', function(req, res, next) {
	var locations = req.locations.split("#");
	query = { locationId : { $in: locations }};
	
	EventLog.find(query, function(err, eventLogs) {
			if (err) res.status(400).send(new Response().error(400,err.errors));
			else res.json(new Response(eventLogs));
	});	
});

/* Insert Event */
router.post('/', function(req, res, next) {
	
	var locations = req.locations.split("#");
	query = { locationId : { $in: locations }};
	
	var deviceId = req.body.event.deviceId;
	
	var eventLog = new EventLog();
	eventLog.device = req.body.event.device;
	eventLog.sensor = req.body.event.sensor;
	eventLog.event = req.body.event.event;
	eventLog.locationId = locations[0];
		
	eventLog.save(function(err) {
		if (err) res.status(400).send(new Response().error(400,err.errors));
		else{
			
			var query = { 'id' : deviceId };
			var updates = { $push: {events: {date : new Date()}}};
			Device.findOneAndUpdate(query, updates, function(err, device) {
				if (err) res.status(400).send(new Response().error(400,err.errors));
				else{
					userLogic.userUpdateHasNewUpdates(locations[0], true);					
					res.json(new Response(eventLog));
				}
			})
		}
	});
		
});

module.exports = router;
