var express = require('express');
var router = express.Router();

var EventLog = require('../models/eventLog');
var Response = require('./response');

/* GET EventLog listing. */
router.get('/', function(req, res, next) {
	var locations = req.locations.split("#");
	query = { locationId : { $in: locations }};
	
	EventLog.find(query, function(err, eventLogs) {
			if (err) res.status(400).send(new Response().error(400,err.errors));
			res.json(new Response(eventLogs));
	});	
});

/* Insert Event */
router.post('/', function(req, res, next) {
	
	var locations = req.locations.split("#");
	query = { locationId : { $in: locations }};
	
	var eventLog = new EventLog();
	eventLog.device = req.body.event.device;
	eventLog.sensor = req.body.event.sensor;
	eventLog.event = req.body.event.event;
	eventLog.locationId = locations[0];
		
	eventLog.save(function(err) {
		if (err) res.status(400).send(new Response().error(400,err.errors));
		else res.json(new Response(eventLog));
	});
		
});

module.exports = router;
