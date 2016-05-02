
var logger = require('../config/logger.js')('Web');
var Response = require('./response');
var User       = require('../models/user');
var Location       = require('../models/location');

var express = require('express');
var router = express.Router();

var jwt = require('../logic/jwt');


//create a jwt Token 
router.post('/token', function(req, res, next) {
	
	var email = req.body.email;
	var pwd = req.body.pwd;
	logger.info("email ->"+email);
	
	var query = { 'local.email' : email }
	
	User.findOne(query, function(err, user) {

		if (err) res.status(400).send(new Response().error(400,err.errors));
			
		if (user) {
			logger.info("User Found token ->"+user.google.token);
			// if a user is found, log them in
			
			
			var update = { 'local.token': tokens.access_token, 'google.expiry_date' : tokens.expiry_date };
			var opts = { strict: true };
			User.update(query, update, opts, function(error,raw) {
				if (error){
					res.status(400).send(new Response().error(400,err.errors));
				}else{
					res.cookie('token',tokens.access_token, { maxAge: 3600000 });
					if(user.google.refresh_token) res.cookie('refresh_token',user.google.refresh_token);
					res.json(new Response(tokens));
				} 		  
			});			
			
		} else {
			// if the user isnt in our database, create a new user
			var newUser          = new User();
			newUser.google.email = data.payload.email;
			newUser.google.token = tokens.access_token;
			newUser.google.refresh_token  = tokens.refresh_token;
			newUser.google.expiry_date = tokens.expiry_date;

			logger.info("NEW User");
			logger.info(newUser);
			// save the user
			newUser.save(function(err) {
				if (err) res.status(400).send(new Response().error(400,err.errors));
				else {
					res.cookie('token',tokens.access_token, { maxAge: 3600000 });
					if(tokens.refresh_token) res.cookie('refresh_token',tokens.refresh_token);
					res.json(new Response(tokens));
				}
			});
		}
						
	});

});


//refresh jwt token
router.post('/refresh', function(req, res, next) {
	
	var refresh_token = req.body.refresh_token;
	logger.info("Refresh Token ->"+refresh_token);
	
	var aud = jwt.getAudience(refresh_token);
	logger.info("Audience ->"+aud);
	if(aud === "controller"){
		
		var query = { 'controller.refresh_token' : refresh_token }
		Location.findOne(query, function(err, location) {
			if (err){
				logger.error(err);
				return res.status(403).send(new Response().error(403,"Authentication Problem: err location"));
			}	

			if (location) {
				
				logger.info("Location Found controllerId ->"+location.controller.controllerId);

				if(jwt.verifyJWT(refresh_token,location.controller.controllerId)){
													
					var jwtToken = jwt.getJWT(location.controller.controllerId,true,"controller");
				
					var update = { "controller.token" : jwtToken.access_token };
					var opts = { strict: true };
					Location.update({'_id' : location._id}, update, opts, function(error,raw) {
						if (error){
							res.status(400).send(new Response().error(400,err.errors));
						}else{
							res.json(new Response(jwtToken));
						} 		  
					});		

				}else{
					logger.error("Authentication Problem: token expired");
					return res.status(403).send(new Response().error(403,"Authentication Problem: token expired"));
				}
			}else{
				logger.error("Authentication Problem: no location found");
				return res.status(403).send(new Response().error(403,"Authentication Problem: no location found"));
			}

		});

		
	} else {

		var query = { 'auth.local.refresh_token' : refresh_token }
		
		User.findOne(query, function(err, user) {

			if (err) res.status(400).send(new Response().error(400,err.errors));
				
			if (user) {
				logger.info("User Found token ->"+user.auth.local.email);
				// if a user is found, log them in
				if(jwt.verifyJWT(refresh_token,user.auth.local.email)){
					
					var jwtToken = jwt.getJWT(user.auth.local.email,false,"web");
					logger.info("JWT ->");
					logger.info(jwtToken);
				
					var update = { 'auth.local.token': jwtToken.access_token};
					var opts = { strict: true };
					User.update(query, update, opts, function(error,raw) {
						if (error){
							res.status(400).send(new Response().error(400,err.errors));
						}else{
							res.cookie('token',jwtToken.access_token, { maxAge: jwtToken.duration_time });
							res.cookie('token_expire_at',jwtToken.expire_at, { maxAge: jwtToken.duration_time });
							res.json(new Response(jwtToken));
						} 		  
					});		
				} else res.status(403).send(new Response().error(403,"Authentication Problem: jwt varification failed"));			
				
			} else res.status(403).send(new Response().error(403,"Authentication Problem: no user found"));
							
		});
	
	}

});




//register controller
router.post('/controller', function(req, res, next) {

	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
	logger.info("Controller IP ->"+ip);
	
	var controllerId = req.body.controllerId;
	logger.info("controllerId ->"+controllerId);
	
	var query = { 'router_ip' : ip };
	if(ip =="::1" || ip =="::ffff:127.0.0.1"){
		query = { 'router_ip' : { $in: [ "::1", "::ffff:127.0.0.1" ] } }
	}
	
	Location.findOne(query, function(err, location) {

		if (err) res.status(400).send(new Response().error(400,err.errors));
			
		if (location) {
			logger.info("Location Found token ->"+location.name);
				
			var jwtToken = jwt.getJWT(controllerId,true,"controller");
		
			var update = { controller : { "controllerId": controllerId, 
										  "token" : jwtToken.access_token,
										  "refresh_token" : jwtToken.refresh_token } };
			var opts = { strict: true };
			Location.update({'_id' : location._id}, update, opts, function(error,raw) {
				if (error){
					res.status(400).send(new Response().error(400,err.errors));
				}else{
					res.json(new Response(jwtToken));
				} 		  
			});		
			
		} else res.status(403).send(new Response().error(403,"Authentication Problem: no location found"));				
	});
});




//register controller
router.post('/sendEmail', function(req, res, next) {
	
	var nodemailer = require('nodemailer');
	 
	// create reusable transporter object using the default SMTP transport 
	var transporter = nodemailer.createTransport('smtps://pistillo.stefano%40libero.it:Magacirce1@smtp.libero.it');
	 
	// setup e-mail data with unicode symbols 
	var mailOptions = {
		from: '<pistillo.stefano@libero.it>', // sender address 
		to: 'stefano.pistillo@gmail.com', // list of receivers 
		subject: 'DomusGuard', // Subject line 
		text: 'Hello world', // plaintext body 
		html: '<b>Hello world</b>' // html body 
	};
	 
	// send mail with defined transport object 
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			return console.log(error);
		}
		console.log('Message sent: ' + info.response);
	});

});



module.exports = router;




