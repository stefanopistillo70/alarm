var express = require('express');
var router = express.Router();

var SensorLog = require('../domain/sensorLog');


/* GET SensorLog listing. */
router.get('/', function(req, res, next) {
	SensorLog.find({}, function(err, sensorLogs) {
				if (err){
					console.log(err);
					throw err;
				}
				res.json(sensorLogs);
	});	
});

module.exports = router;
