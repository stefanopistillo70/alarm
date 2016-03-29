var express = require('express');
var router = express.Router();

var Config = require('../domain/config');

/* GET Config listing. */
router.get('/', function(req, res, next) {
	Config.find({}, function(err, eventLogs) {
				if (err){
					console.log(err);
					throw err;
				}
				res.json(eventLogs);
	});	
});


router.put	('/:id', function(req, res, next) {
				 
		var config = req.body;
		
		console.log(config);
		
		var update = { 'enableNewDevice': config.enableNewDevice };
		var opts = { strict: true };
		Config.update({}, update, opts, function(error) {
			if(error) throw new Error(error);
			res.json('OK');
		});	
});




module.exports = router;
