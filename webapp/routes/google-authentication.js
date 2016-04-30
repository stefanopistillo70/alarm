
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
					
					var query = { 'auth.google.email' : ticketAttr.payload.email }
					
					User.findOne(query, function(err, user) {
		
						if (err) res.status(400).send(new Response().error(400,err.errors));
													
						if (user) {
							logger.info("User Found token ->"+user.auth.google.token);
							// if a user is found, log them in
							
							var jwtToken = jwt.getJWT(ticketAttr.payload.email,false,"web");
							logger.info("JWT ->");
							logger.info(jwtToken);
														
							var update = { 'auth.local.token': jwtToken.access_token, 'auth.google.token': googleTokens.access_token, 'auth.google.expiry_date' : googleTokens.expiry_date };
							var opts = { strict: true };
							User.update(query, update, opts, function(error,raw) {
								if (error){
									res.status(400).send(new Response().error(400,error));
								}else{
									var sec_expire_time = jwtToken.duration_time/4;
									res.cookie('token',jwtToken.access_token, { maxAge: (jwtToken.duration_time - sec_expire_time) });
									res.cookie('token_expire_at',(jwtToken.expire_at - sec_expire_time), { maxAge: (jwtToken.duration_time - sec_expire_time) });
									if(user.auth.local.refresh_token) res.cookie('refresh_token',user.auth.local.refresh_token);
									res.json(new Response(jwtToken));
								} 		  
							});			
							
						} else {
							
							// if the user isnt in our database, create a new user
							var newUser          = new User();
						
							var jwtToken = jwt.getJWT(ticketAttr.payload.email,true,"web");
							logger.info("JWT ->");
							logger.info(jwtToken);
						
							newUser.auth.local.email = ticketAttr.payload.email;
							newUser.auth.local.token = jwtToken.access_token;
							newUser.auth.local.refresh_token = jwtToken.refresh_token;
							
							newUser.auth.google.email = ticketAttr.payload.email;
							newUser.auth.google.token = googleTokens.access_token;
							newUser.auth.google.refresh_token  = googleTokens.refresh_token;
							newUser.auth.google.expiry_date = googleTokens.expiry_date;
							
							userLogic.createUser(newUser, ip, function(err) {
								if (err) res.status(400).send(new Response().error(400,err.errors));
								else {
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
				
			});
		
		}

	});
	
});


var verifyIdToken = function(token,callback){
	logger.info("VERIFY token ID");
	oauth2Client.verifyIdToken(token, configAuth.googleAuth.clientID , callback);
};



module.exports = router;




