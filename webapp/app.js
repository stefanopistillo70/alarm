
var fs = require('fs');
var https = require('https');
	
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var passport = require('passport');


var routes = require('./routes/routes');
var eventLog = require('./routes/eventLog');
var device = require('./routes/device');
var config = require('./routes/config');
var zone = require('./routes/zone');
var auth = require('./routes/authentication');




var mongoose = require('mongoose');

var sysConfig = require('config');
var dbConfig = sysConfig.get('dbConfig');

mongoose.connect(dbConfig.url, function(err) {
    if(err) {
        console.log('connection error', err);
    } else {
        console.log('connection successful');
    }
});



var app = express();

app.use(function(req, res, next) {
	console.log("CHECK ALL");
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
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
app.use(passport.initialize());
app.use(passport.session());

app.use('/', routes);
app.use('/eventLog', eventLog);
app.use('/device', device);
app.use('/config', config);
app.use('/zone', zone);
app.use('/auth', auth);




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


module.exports = app;
