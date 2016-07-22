var express = require('express');
var router = express.Router();

var logger = require('../config/logger.js')('User');
var User = require('../models/user');
var Location = require('../models/location');
var Response = require('./response');

/* GET Users listing. */
router.get('/', function(req, res, next) {
	
	var locations = req.locations.split("#");
	
	logger.info("User get list for location : "+locations);
	query = { locations : {$elemMatch: { _id : locations}}};
	
	User.find(query, function(err, users) {
				if (err){
					res.status(400).send(err);
				}else{
					var resultUser = [];
					for (i = 0; i < users.length; i++) { 
								resultUser[i] = {};
								resultUser[i].email = users[i].auth.local.email;
					}
					res.json(new Response(resultUser));
				} 
	});	
});

/* create User. */

router.post('/', function(req, res, next) {
	
	var email  = req.body.email;
	logger.info("Add new user : "+email);
	var locations = req.locations.split("#");
	logger.info("locations : "+locations);
	if(locations.length > 1) res.status(400).send(new Response().error(400,"More than one location specified"));
	else{

		query = { _id :  locations[0]}
		Location.find(query, function(err, locations) {
					if (err){
						res.status(400).send(new Response().error(400,err.errors));
					}else{
						if((locations != undefined) && (locations.length > 0)){
								
								logger.info("Created a new user");
								var newUser = new User();
								newUser.auth.role = "user";
								newUser.auth.local.email = email;
								newUser.auth.local.token ="token"; 
								newUser.locations = [];
								newUser.locations.push(locations[0]._id);
								
								// save the user
								newUser.save(function(err) {
									if (err){
										logger.error("Error Create User: ");
										logger.error(err);
										res.status(400).send(new Response().error(400,err.errors));;
									}else res.json(new Response("User Created"));
								});	
						}else{ 
							res.status(400).send(new Response().error(400,"No Location found...")); 
						}
					} 
				});
	};
});

/*
router.get('/:id', function(req, res, next) {
	logger.info('ID -> '+req.params.id)
	//TODO
	Device.find({}, function(err, eventLogs) {
				if (err){
					res.status(400).send(new Response().error(400,err.errors));
				}else res.json(eventLogs);
	});	
});


router.put('/:id', function(req, res, next) {
		
		var device = req.body;
		
		var query = { '_id' : device._id}
		var update = { 'name' : device.name, 'deviceType' : device.deviceType };
		var opts = { strict: true };
		Device.update(query, update, opts, function(error,raw) {
			if (error){
				res.status(400).send(new Response().error(400,err.errors));
			}else{
				res.json(new Response("Device Updated"));
			} 		  
		});			
});


router.delete('/:id', function(req, res, next) {
		
		logger.info('ID -> '+req.params.id)
		
		Device.remove({ _id: req.params.id }, function(error,raw) {
			if (error) {
				res.status(400).send(new Response().error(400,err.errors));
			} else {
				res.json(new Response("Device Removed"));	
			}
		});
		
});
*/

module.exports = router;
