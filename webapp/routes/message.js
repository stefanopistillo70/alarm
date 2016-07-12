var express = require('express');
var router = express.Router();

var Response = require('./response');

var Message = require('../models/message');

var userLogic = require('../logic/userLogic');
var logger = require('../config/logger.js')('Message');

/* GET Messages listing. */
router.get('/', function(req, res, next) {
	var locations = req.locations.split("#");
	query = { locationId : { $in: locations }};
	
	Message.find(query, function(err, eventLogs) {
			if (err) res.status(400).send(new Response().error(400,err.errors));
			else res.json(new Response(eventLogs));
	});	
});

/* Insert new message */
router.post('/', function(req, res, next) {
	
	var message = new Message();
	
	message.level = req.body.message.level;
	message.message = req.body.message.message;
	message.locationId = req.locations;
	
	message.save(function(err) {
				if (err) res.status(400).send(new Response().error(400,err.errors));
				else {
					userLogic.sendNotifyToAllUsers(message.locationId,message);
					res.json(new Response(message));
				}
	});
});


//get most recent message
router.post('/last', function(req, res, next) {
	
	logger.info("Get Last Msg for location :"+req.locations);

	query = { locationId : req.locations};
	
	Message.findOne(query).
		sort({ insertDate: -1 }).
		exec(function(err, message) {
				if (err){
					res.status(400).send(err);
				}else res.json(new Response(message));
		});	
	
	
	
/*	query = { locationId : req.locations}
	Message.find(query, function(err, messages) {
				if (err){
					res.status(400).send(err);
				}else res.json(new Response(messages));
	});	
*/	
});


module.exports = router;
