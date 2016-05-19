
var crypto = require('crypto');
const saltRounds = 10;

var logger = require('../config/logger.js')('LocalAuth');
var Response = require('./response');
var User       = require('../models/user');
var Location       = require('../models/location');
var userLogic = require('../logic/userLogic');

var express = require('express');
var router = express.Router();

var jwt = require('../logic/jwt');



router.get('/token/:userId', function(req, res, next) {
	var email = req.params.userId;
	
	var query = { 'auth.local.email' : email }
	
	User.findOne(query, function(err, user) {

		if (err){
			logger.error("User find Error : ");
			logger.error(err);
			res.status(400).send(new Response().error(400,"Internal Server Error"));
		}else{
			if (user) {
				logger.debug("User Found");
				if (user.auth.local.passwd) res.json(new Response("local"));
				else res.json(new Response(""));
			} else {
				res.status(404).send(new Response().error(404,""));
			}
		}		
	});
	
});

//create a jwt Token 
router.post('/token', function(req, res, next) {
	
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
	logger.debug("IP ->"+ip);

	var email = req.body.email;
	var pwd = req.body.pwd;
	var name = req.body.name;
	var location = req.body.location;
	
	logger.debug("email ->"+email);
	
	var query = { 'auth.local.email' : email }
	
	User.findOne(query, function(err, user) {

		if (err){
			logger.error("User find Error : ");
			logger.error(err);
			res.status(400).send(new Response().error(400,"Internal Server Error"));
		}else{	
			if (user) {
				logger.debug("User Found token");
				// if a user is found, verify password
				if(user.auth.local.pwd){
					verifyHashPassword(pwd,user.auth.local.pwd,user.auth.local.salt, function(err, result){
						
						if (err){
							logger.error("Verification Error : ");
							logger.error(err);
							res.status(403).send(new Response().error(403,"Authorization problem: user or pwd are wrong"));
						}else{
							if(result.verified){
								
								var jwtToken = jwt.getJWT(email,true,"web",user.auth.role);
								
								var update = { 'auth.local.token': jwtToken.access_token, 'auth.local.refresh_token': jwtToken.refresh_token};
								
								var opts = { strict: true };
								User.update(query, update, opts, function(err,raw) {
									if (err){
										logger.error("User update Error : ");
										logger.error(err);
										res.status(400).send(new Response().error(400,"Internal Server Error"));
									}else{
										var sec_expire_time = jwtToken.duration_time/4;
										res.cookie('token',jwtToken.access_token, { maxAge: (jwtToken.duration_time - sec_expire_time) });
										res.cookie('token_expire_at',(jwtToken.expire_at - sec_expire_time), { maxAge: (jwtToken.duration_time - sec_expire_time) });
										if(jwtToken.refresh_token) res.cookie('refresh_token',jwtToken.refresh_token);
										res.json(new Response(jwtToken));
									} 		  
								});			

							}else {
								logger.error("Password verification failed.");
								res.status(403).send(new Response().error(403,"Authorization problem: user or pwd are wrong"));
							}
						}
					});
				}else {
					logger.error("Password is null");
					res.status(403).send(new Response().error(403,"Authorization problem: user or pwd are wrong"));
				}
							
			} else {
				// if the user isnt in our database, create a new user
				var newUser          = new User();
			
				var jwtToken = jwt.getJWT(email,true,"web","admin");
				logger.debug("JWT ->");
				logger.debug(jwtToken);
			
				newUser.auth.local.name = name;
				newUser.auth.local.email = email;
				newUser.auth.local.token = jwtToken.access_token;
				newUser.auth.local.refresh_token = jwtToken.refresh_token;
				
				
				generateHashPassword(pwd, function(err, result){
					if (err){
						logger.error("Generate Hash password : ");
						logger.error(err);
						res.status(400).send(new Response().error(400,"Internal Server Error"));
					}else{
						newUser.auth.local.salt = result.salt;
						newUser.auth.local.pwd = result.hash;
						
						userLogic.createUser(newUser, ip, function(err) {
							if (err){
								logger.error("User create Error : ");
								logger.error(err);
								res.status(400).send(new Response().error(400,"Internal Server Error"));
							} else {
								logger.debug("New User Created : "+newUser.auth.local);
								var sec_expire_time = jwtToken.duration_time/4;
								res.cookie('token',newUser.auth.local.token, { maxAge: (jwtToken.duration_time - sec_expire_time) });
								res.cookie('token_expire_at',(jwtToken.expire_at - sec_expire_time), { maxAge: (jwtToken.duration_time - sec_expire_time) });
								if(newUser.auth.local.refresh_token) res.cookie('refresh_token',newUser.auth.local.refresh_token);
								res.json(new Response(jwtToken));
							}
						});
					}
					
				});
			}
		}					
	});

});


//refresh jwt token
router.post('/refresh', function(req, res, next) {
	
	var refresh_token = req.body.refresh_token;
	logger.debug("Refresh Token ->"+refresh_token);
	
	var tokenInfo = jwt.getInfo(refresh_token);
	var aud = tokenInfo.aud;
	logger.debug("Audience ->"+aud);
	if(aud === "controller"){
		
		var query = { 'controller.refresh_token' : refresh_token }
		Location.findOne(query, function(err, location) {
			if (err){
				logger.error(err);
				res.status(403).send(new Response().error(403,"Authentication Problem: err location"));
			}else{	

				if (location) {
					
					logger.debug("Location Found controllerId ->"+location.controller.controllerId);

					if(jwt.verifyJWT(refresh_token,location.controller.controllerId)){
														
						var jwtToken = jwt.getJWT(location.controller.controllerId,true,"controller","controller");
					
						var update = { "controller.token" : jwtToken.access_token };
						var opts = { strict: true };
						Location.update({'_id' : location._id}, update, opts, function(err,raw) {
							if (err){
								logger.error("Location update Error : ");
								logger.error(err);
								res.status(400).send(new Response().error(400,"Internal Server Error"));
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
			}

		});

		
	} else {

		var query = { 'auth.local.refresh_token' : refresh_token }
		
		User.findOne(query, function(err, user) {

			if (err){
				logger.error("Error on get users : ");
				logger.error(err);
				res.status(400).send(new Response().error(400,"Internal Server Error"));
			}else{	
				if (user) {
					logger.debug("User Found token ->"+user.auth.local.email);
					// if a user is found, log them in
					if(jwt.verifyJWT(refresh_token,user.auth.local.email)){
						
						var jwtToken = jwt.getJWT(user.auth.local.email,false,"web",user.auth.role);
						logger.debug("JWT ->");
						logger.debug(jwtToken);
					
						var update = { 'auth.local.token': jwtToken.access_token};
						var opts = { strict: true };
						User.update(query, update, opts, function(err,raw) {
							if (err){			
								logger.debug("User update Error : ");
								logger.debug(err);
								res.status(400).send(new Response().error(400,"Internal Server Error"));
							}else{
								res.cookie('token',jwtToken.access_token, { maxAge: jwtToken.duration_time });
								res.cookie('token_expire_at',jwtToken.expire_at, { maxAge: jwtToken.duration_time });
								res.json(new Response(jwtToken));
							} 		  
						});		
					} else { 
						logger.error("Authentication Problem: jwt varification failed");
						res.status(403).send(new Response().error(403,"Authentication Problem: jwt varification failed"));			
					}
					
				} else {
					logger.error("Authentication Problem: no user found");
					res.status(403).send(new Response().error(403,"Authentication Problem: no user found"));
				}
			}						
		});
	
	}

});




//register controller
router.post('/controller', function(req, res, next) {

	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
	logger.debug("Controller IP ->"+ip);
	
	var controllerId = req.body.controllerId;
	logger.debug("controllerId ->"+controllerId);
	
	var query = { 'router_ip' : ip };
	if(ip =="::1" || ip =="::ffff:127.0.0.1"){
		query = { 'router_ip' : { $in: [ "::1", "::ffff:127.0.0.1" ] } }
	}
	
	Location.findOne(query, function(err, location) {

		if (err){
			logger.error("Location find Error : ");
			logger.error(err);
			res.status(400).send(new Response().error(400,"Internal Server Error"));
		}else{	
			if (location) {
				logger.debug("Location Found token ->"+location.name);
					
				var jwtToken = jwt.getJWT(controllerId,true,"controller","controller");
			
				var update = { controller : { "controllerId": controllerId, 
											  "token" : jwtToken.access_token,
											  "refresh_token" : jwtToken.refresh_token } };
				var opts = { strict: true };
				Location.update({'_id' : location._id}, update, opts, function(error,raw) {
					if (error){
						logger.error("Location Update Error : ");
						logger.error(err);
						res.status(400).send(new Response().error(400,"Internal Server Error"));
					}else{
						res.json(new Response(jwtToken));
					} 		  
				});		
				
			} else {
				logger.error("Authentication Problem: no location found");
				res.status(403).send(new Response().error(403,"Authentication Problem: no location found"));				
			}
		}
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

var generateHashPassword = function(pwd, callback){
	
	crypto.randomBytes(128, function (err, salt) {
		if (err) { throw err; }
		salt = new Buffer(salt).toString('hex');
		crypto.pbkdf2(pwd, salt, 7000, 256, function (err, hash) {
			var result = {salt : salt, hash : (new Buffer(hash).toString('hex')) };		  
			callback(err,result);	
		});
	});
}



var verifyHashPassword = function(pwdIn, hashIn, salt, callback){
		
	crypto.pbkdf2(pwdIn, salt, 7000, 256, function (err, hash) {
		
		var hashHex = (new Buffer(hash).toString('hex'));
		if(err) callback(err);
		else{
			var result = {};
			if(hashIn === hashHex) result = { verified : true };
			else result = { verified : false };
			callback(err,result);
		}
	});
}

module.exports = router;




