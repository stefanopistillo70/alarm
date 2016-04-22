var express = require('express');
var router = express.Router();

//var Message = require('../models/message');
var Response = require('./response');

/* POST Message listing. */
router.post('/', function(req, res, next) {
	
	res.json(new Response({ level : "info", message : "System Disarmed"}))
	
	/*Message.find({}, function(err, messages) {
				if (err){
					res.status(400).send(err);
				}else res.json(new Response(messages));
	});	
	*/
});




module.exports = router;
