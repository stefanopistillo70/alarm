
var fs = require('fs');
var https = require('https');
	
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/routes');
var eventLog = require('./routes/eventLog');
var device = require('./routes/device');
var config = require('./routes/config');
var zone = require('./routes/zone');
var message = require('./routes/message');
var auth_google = require('./routes/google-authentication');
var local_auth = require('./routes/local-authentication');
var controller = require('./routes/controller');
var google = require('./routes/google');
var main = require('./routes/main');
var user = require('./routes/user');


var Response = require('./routes/response');
var User       = require('./models/user');
var Location       = require('./models/location');
var jwt = require('./logic/jwt');
var logger = require('./config/logger.js')('Web');

var mongoose = require('mongoose');

var sysConfig = require('config');
var dbConfig = sysConfig.get('dbConfig');

var apiVer = "/api/1.0";

var options = {
  server: { ssl: true, sslValidate: false }
}

mongoose.connect(dbConfig.url, options, function(err) {
    if(err) {
        logger.error('connection error', err);
    } else {
        logger.info('connection successful');
    }
});


var app = express();

/**************************************
/
/	Intercept all request and check for token
/
***************************************/
app.use(function(req, res, next) {
	var url = req.url;
	logger.info("****** CHECK ALL URL -> "+url);
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
	//var ip = req.headers['x-forwarded-for'];
	logger.info("****** CHECK ALL IP ->"+ip);
	
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	
	var token = req.headers['x-access-token'];
	
	
	var urlLogin = apiVer + "/auth";
	var urlGoogleUpdateConsensus = apiVer + "/auth/google/updateConsensus";
	
	var urlLastMsg = apiVer + "/message/last";
	
	if(url.substring(0, apiVer.length) == apiVer 
		&&  ( !(url.substring(0, urlLogin.length) == urlLogin) || (url === urlGoogleUpdateConsensus) )
	){
			
		if (token) {
			if(urlLastMsg === url){
				var gcm = token.replace("https://android.googleapis.com/gcm/send/", "");
				logger.info("Last msg GCM : "+gcm);
				
				var query = { 'google.gcm.web' : gcm };

				User.findOne(query, function(err, user) {
					
					if (err){
						logger.error(err);
						return res.status(403).send(new Response().error(403,"Authentication Problem: err user"));
					}	

					if (user) {
						req.userId = user._id;
						if (user.location_view){
							req.locations = user.location_view;
						}else{
							req.locations = "";
							for(var i=0; i< user.locations.length;i++){
								if(i < (user.locations.length -1) ) req.locations += user.locations[i]._id+"#";
								else req.locations += user.locations[i]._id;
							}
						}						
						next();
					}else{
						logger.error("Authentication Problem: no user found");
						return res.status(403).send(new Response().error(403,"Authentication Problem: no user found"));
					}

				});

				
			}else{
				logger.info("Verify token on DB ->"+token);
				logger.info("Token present");
				var aud = jwt.getAudience(token);
				logger.info("Audience ->"+aud);
				if(aud === "controller"){
						
					var query = { 'controller.token' : token }
					Location.findOne(query, function(err, location) {
						if (err){
							logger.error(err);
							return res.status(403).send(new Response().error(403,"Authentication Problem: err location"));
						}	

						if (location) {
							
							logger.info("Location Found token ->"+location.controller.controllerId);

							if(jwt.verifyJWT(token,location.controller.controllerId)){
								req.locations = location._id;								
								next();
							}else{
								logger.error("Authentication Problem: token expired");
								return res.status(403).send(new Response().error(403,"Authentication Problem: token expired"));
							}
						}else{
							logger.error("Authentication Problem: no location found");
							return res.status(403).send(new Response().error(403,"Authentication Problem: no location found"));
						}

					});
						
				} else {
					var query = { 'auth.local.token' : token }

					User.findOne(query, function(err, user) {
						
						if (err){
							logger.error(err);
							return res.status(403).send(new Response().error(403,"Authentication Problem: err user"));
						}	

						if (user) {
							
							logger.info("User Found token ->"+user.auth.local.email);

							if(jwt.verifyJWT(token,user.auth.local.email)){
								
								req.userId = user._id;
								if (user.location_view){
									req.locations = user.location_view;
								}else{
									req.locations = "";
									for(var i=0; i< user.locations.length;i++){
										if(i < (user.locations.length -1) ) req.locations += user.locations[i]._id+"#";
										else req.locations += user.locations[i]._id;
									}
								}
								
								next();
							}else{
								logger.error("Authentication Problem: token expired");
								return res.status(403).send(new Response().error(403,"Authentication Problem: token expired"));
							}
						}else{
							logger.error("Authentication Problem: no user found");
							return res.status(403).send(new Response().error(403,"Authentication Problem: no user found"));
						}

					});
				};
			};
						
		}else{
			return res.status(403).send(new Response().error(403,"Authentication Problem : no token provided"));
		}
	}else{
		logger.info("****** skip auth check...continue...");
		next();
	} 
});


https.createServer({
  key: fs.readFileSync('../environment/Development/resource/certs/server.key'),
  cert: fs.readFileSync('../environment/Development/resource/certs/server.crt')
}, app).listen(443);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(apiVer+'/', routes);
app.use(apiVer+'/eventLog', eventLog);
app.use(apiVer+'/device', device);
app.use(apiVer+'/config', config);
app.use(apiVer+'/zone', zone);
app.use(apiVer+'/auth/google', auth_google);
app.use(apiVer+'/auth', local_auth);
app.use(apiVer+'/message', message);
app.use(apiVer+'/controller', controller);
app.use(apiVer+'/google', google);
app.use(apiVer+'/main', main);
app.use(apiVer+'/user', user);




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
/*
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}
*/

// production error handler
// no stacktraces leaked to user
/*
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
*/

module.exports = app;
