var express = require('express');
var router = express.Router();

var Config = require('../domain/config');
var Response = require('./response');

/* GET Config listing. */
router.get('/', function(req, res, next) {
	Config.find({}, function(err, eventLogs) {
				if (err){
					res.status(400).send(new Response().error(400,err.errors));
				}
				res.json(eventLogs);
	});	
});


router.put	('/:id', function(req, res, next) {
				 
		var config = req.body;
		
		console.log(config);
		
		var update = { 'enableNewDevice': config.enableNewDevice };
		var opts = { strict: true };
		Config.update({}, update, opts, function(err) {
			if(err) res.status(400).send(new Response().error(400,err.errors));
			res.json('OK');
		});	
});




module.exports = router;
