
var Response = require('./response');
var User       = require('../models/user');

var express = require('express');
var router = express.Router();

// load up the user model
var User       = require('../models/user');

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

//Verify token
router.post('/google', function(req, res, next) {
	
	console.log(req.body);
	
	var code = req.body.code;
	console.log("code ->"+code);
	
	oauth2Client.getToken(code, function(err, tokens) {
		
		console.log("TOKEN ->");
		console.log(tokens);
		
		
		if(err) res.status(400).send(new Response().error(400,err));			
		else{

			verifyIdToken(tokens.id_token,function(err,ticket){
				
				if(err){
					res.status(403).send(new Response().error(403,"Invalid ID Token ->"+err));
				} else {
				
					var data = ticket.getAttributes();
					console.log(data);
					
					var query = { 'google.email' : data.payload.email }
					
					User.findOne(query, function(err, user) {
		
						if (err) res.status(400).send(new Response().error(400,err.errors));
							
						if (user) {
							console.log("User Found token ->"+user.google.token);
							// if a user is found, log them in
							
							if(tokens.access_token != user.google.token){
								console.log("ACEES TOKEN  DIFF ");
								console.log("DB ->"+user.google.token);
								console.log("google ->"+tokens.access_token);
							}
							
							var update = { 'google.token': tokens.access_token, 'google.expiry_date' : tokens.expiry_date };
							var opts = { strict: true };
							User.update(query, update, opts, function(error,raw) {
								if (error){
									res.status(400).send(new Response().error(400,err.errors));
								}else{
									console.log(raw);
								} res.json(new Response(tokens));		  
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
								res.json(new Response());
							});
						}
										
					});

				} 
				
			});
		
		}

	});
	
});


var verifyIdToken = function(token,callback){
	console.log("VERIFY token ID");
	oauth2Client.verifyIdToken(token, configAuth.googleAuth.clientID , callback);
}


module.exports = router;




