

var Client = require('node-rest-client').Client;
var client = new Client();

var logger = require('../config/logger.js')('GoogleAuth');
var Response = require('./response');
var User     = require('../models/user');

var userLogic = require('../logic/userLogic');

var express = require('express');
var router = express.Router();


var jwt = require('../logic/jwt');

//TODO put on config file
var configAuth = {
	   'googleAuth' : {
        'clientID'      : '347967676922-9lsavri7424fsn1bmjcoepm3tme8bbfd.apps.googleusercontent.com',
        'clientSecret'  : 'crk3KvehjxYlukK1z4U9TZPP',
        'callbackURL'   : 'http://localhost:3000'
    }
};

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(configAuth.googleAuth.clientID, configAuth.googleAuth.clientSecret, configAuth.googleAuth.callbackURL);

/********************************
*
* Verify Google account and return a JWT
*
*********************************/
router.post('/', function(req, res, next) {
	
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
	logger.info("IP ->"+ip);

	
	var code = req.body.code;
	logger.info("GOOGLE CODE ->"+code);
	
	oauth2Client.getToken(code, function(err, googleTokens) {
		
		logger.info("GOOGLE token ->");
		logger.info(googleTokens);
		
		if(err) res.status(400).send(new Response().error(400,err));			
		else{

			verifyIdToken(googleTokens.id_token,function(err,ticket){
				
				if(err){
					res.status(403).send(new Response().error(403,"Invalid ID Token ->"+err));
				} else {
				
					var ticketAttr = ticket.getAttributes();
					logger.info("GOOGLE verified ticket ->");
					logger.info(ticketAttr);
					
					getUserInfo(googleTokens.access_token, function(userInfo){
					
						logger.info("Got User Info ->");
						logger.info(userInfo);
						var query = { 'auth.local.email' : ticketAttr.payload.email }
						
						User.findOne(query, function(err, user) {
						
							if (err){
								logger.info(err);
								res.status(400).send(new Response().error(400,err));
							}else{							
								if (user) {
									logger.info("User Found token ->"+user.auth.google.token);
									// if a user is found, log them in
									
									var jwtToken = jwt.getJWT(ticketAttr.payload.email,true,"web",user.auth.role);
									logger.info("JWT ->");
									logger.info(jwtToken);
																
									var update = { 'auth.local.name': userInfo.given_name, 'auth.local.token': jwtToken.access_token, 'auth.local.refresh_token': jwtToken.refresh_token};
									
									var opts = { strict: true };
									User.update(query, update, opts, function(error,raw) {
										if (error){
											res.status(400).send(new Response().error(400,error));
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
										logger.info("NO User Found.");
										var newUser          = new User();
									
										var jwtToken = jwt.getJWT(ticketAttr.payload.email,true,"web","admin");
										logger.info("JWT ->");
										logger.info(jwtToken);
									
										newUser.auth.local.name = userInfo.given_name;
										newUser.auth.local.email = ticketAttr.payload.email;
										newUser.auth.local.token = jwtToken.access_token;
										newUser.auth.local.refresh_token = jwtToken.refresh_token;
																			
										userLogic.createUser(newUser, ip, function(err) {
											if (err) res.status(400).send(new Response().error(400,err.errors));
											else {
												logger.info("New User Created : "+newUser.auth.local);
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
	logger.info("code ->"+code);
	
	var userId = req.userId;
	query = { _id : userId};
	
	oauth2Client.getToken(code, function(err, googleTokens) {
		
		logger.info("TOKEN ->");
		logger.info(googleTokens);
		
		if(err) res.status(400).send(new Response().error(400,err));			
		else{

			verifyIdToken(googleTokens.id_token,function(err,ticket){
				
				if(err){
					res.status(403).send(new Response().error(403,"Invalid ID Token ->"+err));
				} else {
				
					var ticketAttr = ticket.getAttributes();
					logger.info(ticketAttr);
					
					if(googleTokens.refresh_token){
						logger.info("Got refresh token , Update user. ");
						var update = { 'auth.google.token': googleTokens.access_token, 'auth.google.expiry_date' : googleTokens.expiry_date, 'auth.google.refresh_token' : googleTokens.refresh_token };	
						User.findOneAndUpdate(query, update, function(err, user) {
			
							if (err) res.status(400).send(new Response().error(400,err));
														
							if (user) {
								logger.info("User Update -> "+user.auth.name);
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
	res.json(new Response(configAuth.googleAuth.clientID));
});



var verifyIdToken = function(token,callback){
	logger.info("VERIFY token ID");
	oauth2Client.verifyIdToken(token, configAuth.googleAuth.clientID , callback);
};

var getUserInfo = function(token,callback){
	logger.info("Getting  GOOGLE User Info ...");
	
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




