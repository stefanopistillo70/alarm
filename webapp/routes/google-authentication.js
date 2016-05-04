

var Client = require('node-rest-client').Client;
var client = new Client();

var logger = require('../config/logger.js')('Web');
var Response = require('./response');
var User     = require('../models/user');

var userLogic = require('../logic/userLogic');

var express = require('express');
var router = express.Router();


var jwt = require('../logic/jwt');

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

//Verify and store Token
router.post('/', function(req, res, next) {
	
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
	logger.info("IP ->"+ip);

	
	var code = req.body.code;
	logger.info("code ->"+code);
	
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
					
					getUserInfo(googleTokens.access_token, function(userInfo){
					
						console.log(userInfo);
						var query = { 'auth.local.email' : ticketAttr.payload.email }
						
						User.findOne(query, function(err, user) {
			
							if (err) res.status(400).send(new Response().error(400,err.errors));
														
							if (user) {
								logger.info("User Found token ->"+user.auth.google.token);
								// if a user is found, log them in
								
								var jwtToken = jwt.getJWT(ticketAttr.payload.email,true,"web");
								logger.info("JWT ->");
								logger.info(jwtToken);
															
								//var update = { 'auth.local.name': userInfo.given_name, 'auth.local.token': jwtToken.access_token, 'auth.local.refresh_token': jwtToken.refresh_token, 'auth.google.token': googleTokens.access_token, 'auth.google.expiry_date' : googleTokens.expiry_date };
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
									var newUser          = new User();
								
									var jwtToken = jwt.getJWT(ticketAttr.payload.email,true,"web");
									logger.info("JWT ->");
									logger.info(jwtToken);
								
									newUser.auth.local.name = userInfo.given_name;
									newUser.auth.local.email = ticketAttr.payload.email;
									newUser.auth.local.token = jwtToken.access_token;
									newUser.auth.local.refresh_token = jwtToken.refresh_token;
									
									/*newUser.auth.google.email = ticketAttr.payload.email;
									newUser.auth.google.token = googleTokens.access_token;
									newUser.auth.google.refresh_token  = googleTokens.refresh_token;
									newUser.auth.google.expiry_date = googleTokens.expiry_date;
									*/
									
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
											
						});
					
					});
				} 
			});
		}
	});
});






//Store Token for email authorization
router.put('/', function(req, res, next) {
	
	var code = req.body.code;
	logger.info("code ->"+code);
	
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
					
					var query = { 'auth.local.email' : ticketAttr.payload.email };
					var update = { 'auth.google.token': googleTokens.access_token, 'auth.google.expiry_date' : googleTokens.expiry_date, 'auth.google.refresh_token' : googleTokens.refresh_token };	
					User.findOneAndUpdate(query, update, function(err, user) {
		
						if (err) res.status(400).send(new Response().error(400,err.errors));
													
						if (user) {
							logger.info("User Update -> "+user.auth.name);
							res.json(new Response());
						} 									
					});
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
	logger.info("Get  User Info");
	
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




