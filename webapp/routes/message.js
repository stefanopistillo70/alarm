var express = require('express');
var router = express.Router();

//var Message = require('../models/message');
var Response = require('./response');

var Message = require('../models/message');

/* POST Message listing. */
router.post('/', function(req, res, next) {
	
	console.log(req.body);
	//res.json(new Response({ level : "info", message : "System Disarmed"}))
	
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
	
	/*Message.find({}, function(err, messages) {
				if (err){
					res.status(400).send(err);
				}else res.json(new Response(messages));
	});	
	*/
});




module.exports = router;
