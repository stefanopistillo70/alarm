
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
		
		if(err) res.status(400).send(err);			
		else res.json(new Response(tokens));
		/*oauth2Client.verifyIdToken(tokens.id_token, configAuth.googleAuth.clientID , function(err,result){
			console.log(err);
			console.log(result);
			if(err) res.status(400).send(err);			
			else res.json(new Response(tokens));
			
		});
		*/

	});
	
	/*User.findOne({ 'google.name' : profile.id }, function(err, user) {
				if (err)
					res.status(400).send(err);

				if (user) {

					console.log("User Found token ->"+user.google.token);
					// if a user is found, log them in
					res.json(new Response());
				} else {
					// if the user isnt in our database, create a new user
					var newUser          = new User();

					// set all of the relevant information
					newUser.google.id    = profile.id;
					newUser.google.token = token;
					newUser.google.name  = profile.displayName;
					newUser.google.email = profile.emails[0].value; // pull the first email

					console.log("NEW User");
					console.log(newUser);
					// save the user
					newUser.save(function(err) {
						if (err)
							throw err;
						res.json(new Response());
					});
				}
			});
	*/
	
});






module.exports = router;




