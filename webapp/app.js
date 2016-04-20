
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
var auth = require('./routes/authentication');




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

app.use(function(req, res, next) {
	var url = req.url;
	console.log("CHECK ALL "+url);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	
	var token = req.headers['x-access-token'];
	//console.log(token);
	
	var urlLogin = apiVer + "/auth"
	if(url.substring(0, apiVer.length) == apiVer && !(url.substring(0, urlLogin.length) == urlLogin)){
		console.log("Verify token on DB");
		if (token) {
			
			//verifyToken(token,res,next);
			next();
						
		}else{
			return res.status(403).send({ 
				success: false, 
				message: 'No token provided.' 
			});
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




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



//////////////////////////////////// TODO move in authorization

/*var configAuth = {
	   'googleAuth' : {
        'clientID'      : '347967676922-9lsavri7424fsn1bmjcoepm3tme8bbfd.apps.googleusercontent.com',
        'clientSecret'  : 'crk3KvehjxYlukK1z4U9TZPP',
        'callbackURL'   : 'http://localhost:3000'
    }
};

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var oauth2Client = new OAuth2(configAuth.googleAuth.clientID, configAuth.googleAuth.clientSecret, configAuth.googleAuth.callbackURL);

var verifyToken = function(token,res,next){
	console.log("VERIFY token ID");
	oauth2Client.verifyIdToken(token, configAuth.googleAuth.clientID , function(err,ticket){
			console.log(err);
			console.log(ticket);
			if(err){
				res.status(403).send({ 
					success: false, 
					message: 'Invalid Token ->'+err
				});
			} else {
				
				var data = ticket.getAttributes();
				console.log(data);
				next();
			} 
		});
}
*/



module.exports = app;
