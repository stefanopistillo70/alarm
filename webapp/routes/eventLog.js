var express = require('express');
var router = express.Router();

var EventLog = require('../models/eventLog');

var Response = require('./response');



/* GET EventLog listing. */
router.get('/', function(req, res, next) {
	EventLog.find({}, function(err, eventLogs) {
			if (err) res.status(400).send(new Response().error(400,err.errors));
			res.json(new Response(eventLogs));
	});	
});


router.post('/', function(req, res, next) {
	console.log(req.body);
	
	var e = new EventLog();
	e.device = req.body.event.device;
	e.sensor = req.body.event.sensor;
	e.event = req.body.event.event;
	
		
	e.save(function(err) {
		if (err) res.status(400).send(new Response().error(400,err.errors));
		else res.json(new Response(e));
	});
		
});


module.exports = router;
