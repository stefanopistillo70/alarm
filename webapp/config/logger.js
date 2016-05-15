
var winston = require('winston');

var myFormatter = function(module,options){
	return options.timestamp() +'\t'+ options.level.toUpperCase() +'\t['+module+']  '+ (undefined !== options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
	
}


//Default Config
var buildOptions = function(){
	
	return {
	  colorize: true,
	  timestamp: function() {
			var now = new Date();
			return now.getFullYear()+'-'+now.getMonth()+'-'+now.getDay()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()+'.'+now.getMilliseconds();
	  },
	  formatter: function(options) {
			// Return string will be passed to logger. 
			return myFormatter('',options);
	  },
	  level: 'verbose'
	}
};

var transport = new winston.transports.Console(buildOptions());
 
// configure default transports for all loggers in default container 
winston.loggers.options.transports = [transport];



//Web Config
var optWeb = buildOptions();
optWeb.formatter = function(options) {
        return myFormatter('Web',options);
}
winston.loggers.add('Web', {
		transports: [new winston.transports.Console(optWeb)]
});


//Google Auth Config
var optGoogleAuth = buildOptions();
optGoogleAuth.formatter = function(options) {
        return myFormatter('GoogleAuth',options);
}
winston.loggers.add('GoogleAuth', {
		transports: [new winston.transports.Console(optGoogleAuth)]
});


//Google  Config
var optGoogle = buildOptions();
optGoogle.formatter = function(options) {
        return myFormatter('Google',options);
}
winston.loggers.add('Google', {
		transports: [new winston.transports.Console(optGoogle)]
});


//Local Auth Config
var optLocalAuth = buildOptions();
optLocalAuth.formatter = function(options) {
        return myFormatter('LocalAuth',options);
}
winston.loggers.add('LocalAuth', {
		transports: [new winston.transports.Console(optLocalAuth)]
});


//UserLogic Config
var optUserLogic = buildOptions();
optUserLogic.formatter = function(options) {
        return myFormatter('UserLogic',options);
}
winston.loggers.add('UserLogic', {
		transports: [new winston.transports.Console(optUserLogic)]
});


//User Config
var optUser = buildOptions();
optUser.formatter = function(options) {
        return myFormatter('User',options);
}
winston.loggers.add('User', {
		transports: [new winston.transports.Console(optUser)]
});

//Controller Config
var optController = buildOptions();
optController.formatter = function(options) {
        return myFormatter('Controller',options);
}
winston.loggers.add('Controller', {
		transports: [new winston.transports.Console(optController)]
});


//Message Config
var optMessage = buildOptions();
optMessage.formatter = function(options) {
        return myFormatter('Message',options);
}
winston.loggers.add('Message', {
		transports: [new winston.transports.Console(optMessage)]
});

//Device Config
var optDevice = buildOptions();
optDevice.formatter = function(options) {
        return myFormatter('Device',options);
}
winston.loggers.add('Device', {
		transports: [new winston.transports.Console(optDevice)]
});



module.exports = function(arg) {
	return winston.loggers.get(arg);
}

