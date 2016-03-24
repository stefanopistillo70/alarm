var express = require('express');
var router = express.Router();

var Device = require('../domain/device');

/* GET Device listing. */
router.get('/', function(req, res, next) {
	Device.find({}, function(err, eventLogs) {
				if (err){
					console.log(err);
					throw err;
				}
				res.json(eventLogs);
	});	
});

module.exports = router;
