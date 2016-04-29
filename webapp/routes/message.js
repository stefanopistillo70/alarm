var express = require('express');
var router = express.Router();

var Response = require('./response');

var Message = require('../models/message');

/* Insert new message */
router.post('/', function(req, res, next) {
	
	var message = new Message();
	
	message.level = req.body.level;
	message.message = req.body.message;
	message.locationId = req.locations;
	
	message.save(function(err) {
				if (err) res.status(400).send(new Response().error(400,err.errors));
				else {
					res.json(new Response(message));
				}
	});
});


//get most recent message
router.post('/last', function(req, res, next) {
	
	query = { locationId : req.locations}
	Message.find(query, function(err, messages) {
				if (err){
					res.status(400).send(err);
				}else res.json(new Response(messages));
	});	
	
});


module.exports = router;
