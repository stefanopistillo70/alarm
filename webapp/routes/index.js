var express = require('express');
var passport = require('passport');
var p = require('./authentication')(passport);

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'DomusGuard' });
});




// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
router.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

// the callback after google has authenticated the user
router.get('/auth/google/callback',
		passport.authenticate('google', {
				successRedirect : '/profile',
				failureRedirect : '/'
		}));












router.use(function(req, res, next) {
	
	console.log("CHECK ALL");
	
	var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {
  }else{
	  
	  // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    	  
	  
  }
});


module.exports = router;
