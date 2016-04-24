
var Response = require('./response');
var User       = require('../models/user');

var express = require('express');
var router = express.Router();


//create a jwt Token 
router.post('/token', function(req, res, next) {
	
	console.log(req.body);
	
	var email = req.body.email;
	var pwd = req.body.pwd;
	console.log("email ->"+email);
	
	var query = { 'local.email' : email }
	
	User.findOne(query, function(err, user) {

		if (err) res.status(400).send(new Response().error(400,err.errors));
			
		if (user) {
			console.log("User Found token ->"+user.google.token);
			// if a user is found, log them in
			
			
			var update = { 'local.token': tokens.access_token, 'google.expiry_date' : tokens.expiry_date };
			var opts = { strict: true };
			User.update(query, update, opts, function(error,raw) {
				if (error){
					res.status(400).send(new Response().error(400,err.errors));
				}else{
					console.log(raw);
					res.cookie('token',tokens.access_token, { maxAge: 3600000 });
					if(user.google.refresh_token) res.cookie('refresh_token',user.google.refresh_token);
					console.log((new Date()).getTime());
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

			console.log("NEW User");
			console.log(newUser);
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

	console.log(req.body);
	
	var refresh_token = req.body;
	
	var query = { 'local.refresh_token' : email }
	
	User.findOne(query, function(err, user) {

		if (err) res.status(400).send(new Response().error(400,err.errors));
			
		if (user) {
			console.log("User Found token ->"+user.auth.local.email);
			// if a user is found, log them in
			if(jwt.verifyJWT(refresh_token,user.auth.local.email)){
				
				var jwtToken = jwt.getJWT(user.auth.local.email,false);
				console.log("JWT ->");
				console.log(jwtToken);
			
				var update = { 'local.auth.token': jwtToken.access_token};
				var opts = { strict: true };
				User.update(query, update, opts, function(error,raw) {
					if (error){
						res.status(400).send(new Response().error(400,err.errors));
					}else{
						console.log(raw);
						res.cookie('token',jwtToken.access_token, { maxAge: jwtToken.duration_time });
						res.cookie('token_expire_at',jwtToken.expire_at, { maxAge: jwtToken.duration_time });
						res.json(new Response(jwtToken));
					} 		  
				});		
			}			
			
		} else res.status(403).send(new Response().error(403,"Authentication Problem: no user found"));
						
	});

});




module.exports = router;




