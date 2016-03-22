var express = require('express');
var router = express.Router();

var EventLog = require('../domain/eventLog');


/* GET EventLog listing. */
router.get('/', function(req, res, next) {
	EventLog.find({}, function(err, eventLogs) {
				if (err){
					console.log(err);
					throw err;
				}
				res.json(eventLogs);
	});	
});

module.exports = router;
