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


router.post('/', function(req, res, next) {
	console.log(req.body);
	
	var e = new EventLog();
		
	e.save(function(err) {
		if (err) res.send(err);
		else res.json({ message: 'Event created!' });
	});
		
});


module.exports = router;
