var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Response  = require('./response');
var logger = require('../config/logger.js')('Web');

/* GET User Info. */
router.get('/userInfo', function(req, res, next) {

	var userID = req.userId;	
	var query = { '_id' : userID };
	User.findOne(query, function(err, user) {
				if (err){
					res.status(400).send(err);
				}else{
					var data = {}
					data.name = user.auth.local.name;
					data.location = user.location_view;
					res.json(new Response(data));
				} 
	});	
});

/* Logout */
router.post('/logout', function(req, res, next) {
	logger.info("Logout ->"+req.userId+"   ....");
	
	var query = { '_id' : req.userId }
	var updates = { 'auth.local.token' : "", 'auth.local.refresh_token' : ""}
	User.findOneAndUpdate(query, updates, function(err, user) {
		if (err){
			return res.status(403).send(new Response().error(400,err.errors));
		}	

		if (user) {
			logger.info("Logout completed...");
			res.json(new Response());
		}else{
			logger.error("Authentication Problem: no location found");
			return res.status(403).send(new Response().error(400,"Error: no location found"));
		}
	});

	
	
});


module.exports = router;
