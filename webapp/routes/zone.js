var express = require('express');
var router = express.Router();

var Zone = require('../models/zone');
var Response = require('./response');

/* GET Zone listing. */
router.get('/', function(req, res, next) {
	Zone.find({}, function(err, devices) {
				if (err){
					res.status(400).send(err);
				}else res.json(new Response(devices));
	});	
});

/* create Zone. */
router.post('/', function(req, res, next) {
	console.log(req.body);
	
	var zone = new Zone();

	zone.name = req.body.name;
		
	zone.save(function(err) {
		if (err){
			res.status(400).send(new Response().error(400,err.errors));
		}else res.json(new Response("Zone Created"));
	});
		
});


router.get('/:id', function(req, res, next) {
	console.log('ID -> '+req.params.id)
	//TODO
	Zone.find({}, function(err, eventLogs) {
				if (err){
					res.status(400).send(new Response().error(400,err.errors));
				}else res.json(eventLogs);
	});	
});


router.put('/:id', function(req, res, next) {
		
		console.log(req.body);
		
		var zone = req.body;
		
		var query = { '_id' : zone._id}
		var update = { 'name' : zone.name, 'armed' : zone.armed, 'devices' : zone.devices };
		var opts = { strict: true };
		Zone.update(query, update, opts, function(error,raw) {
			if (error){
				res.status(400).send(new Response().error(400,err.errors));
			}else{
				console.log(raw);
			} res.json(new Response("Zone Updated"));		  
		});			
});




module.exports = router;
