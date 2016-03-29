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



router.get('/:id', function(req, res, next) {
	console.log('ID -> '+req.params.id)
	Device.find({}, function(err, eventLogs) {
				if (err){
					console.log(err);
					throw err;
				}
				res.json(eventLogs);
	});	
});


router.put('/:id', function(req, res, next) {
		
		console.log(req.body);
		
		var device = new Device();
		
		device.id = req.body.id;
		
		device.save(function(err) {
            if (err) res.send(err);

            res.json({ message: 'Device created!' });
        });
});




module.exports = router;
