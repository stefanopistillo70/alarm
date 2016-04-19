
var Response = require('./response');
var User       = require('../models/user');

var express = require('express');
var router = express.Router();

/*var LocalStrategy    = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

// load up the user model
var User       = require('../models/user');

var configAuth = {
	   'googleAuth' : {
        'clientID'      : '347967676922-9lsavri7424fsn1bmjcoepm3tme8bbfd.apps.googleusercontent.com',
        'clientSecret'  : 'crk3KvehjxYlukK1z4U9TZPP',
        'callbackURL'   : 'http://127.0.0.1:3000/auth/google/callback'
    }
};


var passport = require('passport');

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
	console.log("SERIALIZE USER");
	done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
	console.log("DESERIALIZE USER");
	User.findById(id, function(err, user) {
		done(err, user);
	});
});
    
*/

// =========================================================================
// GOOGLE ==================================================================
// =========================================================================
/*
passport.use(new GoogleStrategy({

		clientID        : configAuth.googleAuth.clientID,
		clientSecret    : configAuth.googleAuth.clientSecret,
		callbackURL     : configAuth.googleAuth.callbackURL,

	},
	function(token, refreshToken, profile, done) {

		// make the code asynchronous
		// User.findOne won't fire until we have all our data back from Google
		process.nextTick(function() {
			console.log("NEXT TRIK token->"+token);
			// try to find the user based on their google id
			User.findOne({ 'google.id' : profile.id }, function(err, user) {
				if (err)
					return done(err);

				if (user) {

					console.log("User Found token ->"+user.google.token);
					// if a user is found, log them in
					return done(null, user);
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
						return done(null, newUser);
					});
				}
			});
		});

	})
);





// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
//router.get('/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
/*router.get('/google/callback', 
		passport.authenticate('google', { failureRedirect: '/#/login' }),
		function(req, res) {
			console.log("AUTH -> SUCCESS");
			res.redirect("/");
		}
);
*/

//Verify token
router.post('/google', function(req, res, next) {
	
	console.log("********************");
	
	console.log(req.body);
	
	profile = req.body;
	
	res.json(new Response("Ciao"));
	
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




