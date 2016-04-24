
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
var auth = require('./routes/authentication');


var Response = require('./routes/response');
var User       = require('./models/user');

var mongoose = require('mongoose');

var sysConfig = require('config');
var dbConfig = sysConfig.get('dbConfig');

var apiVer = "/api/1.0";

mongoose.connect(dbConfig.url, function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
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
	console.log("CHECK ALL URL -> "+url);
	var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
	//var ip = req.headers['x-forwarded-for'];
	console.log("CHECK ALL IP ->"+ip);
	
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	
	var token = req.headers['x-access-token'];
	//console.log(token);
	
	var urlLogin = apiVer + "/auth"
	//TODO remove message from here
	var urlMessage = apiVer + "/message";
	
	if(url.substring(0, apiVer.length) == apiVer 
		&& !(url.substring(0, urlLogin.length) == urlLogin)
		&& !(url.substring(0, urlMessage.length) == urlMessage) ){
			
		console.log("Verify token on DB");
		if (token) {
			console.log("Token present");
			var query = { 'auth.local.token' : token }

			User.findOne(query, function(err, user) {
				
				if (err){
					console.log(err);
					return res.status(403).send(new Response().error(403,"Authentication Problem: err user"));
				}	

				if (user) {
					
					console.log("User Found token ->"+user.auth.google.email);
					
					var expiry_date = user.auth.local.expiry_date;
					if((expiry_date - (new Date()).getTime()) > 0 ){
						next();
					}else{
						console.log("Authentication Problem: token expired");
						return res.status(403).send(new Response().error(403,"Authentication Problem: token expired"));
					}
				}else{
					console.log("Authentication Problem: no user found");
					return res.status(403).send(new Response().error(403,"Authentication Problem: no user found"));
				}

			});
						
		}else{
			return res.status(403).send(new Response().error(403,"Authentication Problem : no token provided"));
		}
	}else next();
});


https.createServer({
  key: fs.readFileSync('../environment/Development/resource/certs/server.key'),
  cert: fs.readFileSync('../environment/Development/resource/certs/server.crt')
}, app).listen(443);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(apiVer+'/', routes);
app.use(apiVer+'/eventLog', eventLog);
app.use(apiVer+'/device', device);
app.use(apiVer+'/config', config);
app.use(apiVer+'/zone', zone);
app.use(apiVer+'/auth', auth);
app.use(apiVer+'/message', message);




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
