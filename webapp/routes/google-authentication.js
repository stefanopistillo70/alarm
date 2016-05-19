

var Client = require('node-rest-client').Client;
var client = new Client();

var logger = require('../config/logger.js')('GoogleAuth');
var Response = require('./response');
var User     = require('../models/user');

var userLogic = require('../logic/userLogic');

var express = require('express');
var router = express.Router();


var jwt = require('../logic/jwt');

var sysConfig = require('config');
var googleConf = sysConfig.get("google");

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(googleConf.auth.clientID, googleConf.auth.clientSecret, googleConf.auth.callbackURL);

/********************************
*
* Verify Google account and return a JWT
*
*********************************/
router.post('/', function(req, res, next) {
	
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
	logger.debug("IP ->"+ip);

	
	var code = req.body.code;
	logger.debug("GOOGLE CODE ->"+code);
	
	oauth2Client.getToken(code, function(err, googleTokens) {
		
		logger.debug("GOOGLE token ->");
		logger.debug(googleTokens);
		
		if(err){
			logger.error("Google get token problem: ");
			logger.error(err);
			res.status(400).send(new Response().error(400,"Internal Server Error"));			
		}else{

			verifyIdToken(googleTokens.id_token,function(err,ticket){
				
				if(err){
					logger.error("Google verify token problem: ");
					logger.error(err);
					res.status(403).send(new Response().error(403,"Authorization problem: Google problem"));
				} else {
				
					var ticketAttr = ticket.getAttributes();
					logger.debug("GOOGLE verified ticket ->");
					logger.debug(ticketAttr);
					
					getUserInfo(googleTokens.access_token, function(userInfo){
					
						logger.debug("Got User Info ->");
						logger.debug(userInfo);
						var query = { 'auth.local.email' : ticketAttr.payload.email }
						
						User.findOne(query, function(err, user) {
						
							if (err){
								logger.error("User find Error :");
								logger.error(err);
								res.status(400).send(new Response().error(400,"Internal Server Error"));
							}else{							
								if (user) {
									logger.debug("User Found token ->"+user.auth.google.token);
									
									var jwtToken = jwt.getJWT(ticketAttr.payload.email,true,"web",user.auth.role);
									logger.debug("JWT ->");
									logger.debug(jwtToken);
																
									var update = { 'auth.local.name': userInfo.given_name, 'auth.local.token': jwtToken.access_token, 'auth.local.refresh_token': jwtToken.refresh_token};
									
									var opts = { strict: true };
									User.update(query, update, opts, function(err,raw) {
										if (err){
											logger.error("User find Error :");
											logger.error(err);
											res.status(400).send(new Response().error(400,"Internal Server Error"));
										}else{
											var sec_expire_time = jwtToken.duration_time/4;
											res.cookie('token',jwtToken.access_token, { maxAge: (jwtToken.duration_time - sec_expire_time) });
											res.cookie('token_expire_at',(jwtToken.expire_at - sec_expire_time), { maxAge: (jwtToken.duration_time - sec_expire_time) });
											res.cookie('refresh_token',jwtToken.refresh_token);
											if(user.auth.local.refresh_token) res.cookie('refresh_token',user.auth.local.refresh_token);
											res.json(new Response(jwtToken));
										} 		  
									});			
									
								} else {
									
									getUserInfo(googleTokens.access_token, function(userInfo){

										// if the user isnt in our database, create a new user
										logger.debug("NO User Found.");
										var newUser          = new User();
									
										var jwtToken = jwt.getJWT(ticketAttr.payload.email,true,"web","admin");
										logger.debug("JWT ->");
										logger.debug(jwtToken);
									
										newUser.auth.local.name = userInfo.given_name;
										newUser.auth.local.email = ticketAttr.payload.email;
										newUser.auth.local.token = jwtToken.access_token;
										newUser.auth.local.refresh_token = jwtToken.refresh_token;
																			
										userLogic.createUser(newUser, ip, function(err) {
											if(err) {
												logger.error("User create Error :");
												logger.error(err);
												res.status(400).send(new Response().error(400,"Internal Server Error"));
											}else {
												logger.debug("New User Created : "+newUser.auth.local);
												var sec_expire_time = jwtToken.duration_time/4;
												res.cookie('token',newUser.auth.local.token, { maxAge: (jwtToken.duration_time - sec_expire_time) });
												res.cookie('token_expire_at',(jwtToken.expire_at - sec_expire_time), { maxAge: (jwtToken.duration_time - sec_expire_time) });
												if(newUser.auth.local.refresh_token) res.cookie('refresh_token',newUser.auth.local.refresh_token);
												res.json(new Response(jwtToken));
											}
										});
									});	

								}
							}				
						});
					
					});
				} 
			});
		}
	});
});


//Store Token for email authorization
router.post('/updateConsensus', function(req, res, next) {
	
	var code = req.body.code;
	logger.debug("code ->"+code);
	
	var userId = req.userId;
	query = { _id : userId};
	
	oauth2Client.getToken(code, function(err, googleTokens) {
		
		logger.debug("TOKEN ->");
		logger.debug(googleTokens);
		
		if(err){ 
			logger.error("Google token error :");
			logger.error(err);
			res.status(400).send(new Response().error(400,"Internal Server Error"));			
		}else{

			verifyIdToken(googleTokens.id_token,function(err,ticket){
				
				if(err){
					logger.error("Google verify error :");
					logger.error(err);
					res.status(403).send(new Response().error(403,"Google verify error"));
				} else {
				
					var ticketAttr = ticket.getAttributes();
					logger.debug(ticketAttr);
					
					if(googleTokens.refresh_token){
						logger.debug("Got refresh token , Update user. ");
						var update = { 'auth.google.token': googleTokens.access_token, 'auth.google.expiry_date' : googleTokens.expiry_date, 'auth.google.refresh_token' : googleTokens.refresh_token };	
						User.findOneAndUpdate(query, update, function(err, user) {
			
							if (err) res.status(400).send(new Response().error(400,"Internal Server Error"));
														
							if (user) {
								logger.debug("User Update -> "+user.auth.name);
								res.json(new Response());
							} 									
						});

					}else{
						logger.info("refresh token is empty");
						res.status(400).send(new Response().error(400,"Refresh token is empty"));
					}
				} 
			});
		}
	});
});



/********************************
*
* Get Google Client ID 
*
*********************************/
router.get('/', function(req, res, next) {
	res.json(new Response(googleConf.auth.clientID));
});



var verifyIdToken = function(token,callback){
	logger.debug("VERIFY token ID");
	oauth2Client.verifyIdToken(token, googleConf.auth.clientID , callback);
};

var getUserInfo = function(token,callback){
	logger.debug("Getting  GOOGLE User Info ...");
	
	var args = {
		headers: { "Content-Type": "application/json" }
	};
		
	var onResponseEvent = function(data, response) {
		if(response.statusCode == 200){
			callback(data);
		}else{
			logger.error("ERROR getting user info : "+response.statusCode);
		} 
	};
	
	var url = "https://www.googleapis.com/oauth2/v3/userinfo?access_token="+token;
	client.get(url, args, onResponseEvent).on('error', function (err) {
		logger.error("Connection problem for "+err.address+":"+err.port+" -> "+ err.code);
	});
};



module.exports = router;




