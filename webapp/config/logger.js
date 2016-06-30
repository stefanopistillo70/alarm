
var env = process.env.NODE_ENV || 'dev';

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
	  level: 'debug'
	}
};



var buildTransports = function(moduleName, opt){
	
	opt.formatter = function(options) {
        return myFormatter(moduleName,options);
	}
	
	var transports = new Array();
	transports.push(new winston.transports.Console(opt));
	
	//Log on file setup
	var buildOptionsFile = buildOptions();
	buildOptionsFile.formatter = function(options) {
        return myFormatter(moduleName,options);
	};
	buildOptionsFile.filename = 'webapp';
	buildOptionsFile.json = false;
	buildOptionsFile.dirname = "C:/DOMUS/web/logs/";
	
	transports.push(new (require('winston-daily-rotate-file'))(buildOptionsFile));
	
	return transports;
};


// configure default transports for all loggers in default container
var optDefault = buildOptions();
var transports = buildTransports("",optDefault); 
winston.loggers.options.transports = transports;



//Web Config
winston.loggers.add("Web", {
		transports: buildTransports("Web",buildOptions())
});


//Authorization Config
winston.loggers.add("Authorization", {
		transports: buildTransports("Authorization",buildOptions())
});



//Google Auth Config
winston.loggers.add("GoogleAuth", {
		transports: buildTransports("GoogleAuth",buildOptions())
});


//Google  Config
winston.loggers.add("Google", {
		transports: buildTransports("Google",buildOptions())
});


//Local Auth Config
winston.loggers.add("LocalAuth", {
		transports: buildTransports("LocalAuth",buildOptions())
});


//UserLogic Config
winston.loggers.add("UserLogic", {
		transports: buildTransports("UserLogic",buildOptions())
});


//User Config
winston.loggers.add("User", {
		transports: buildTransports("User",buildOptions())
});

//Controller Config
winston.loggers.add('Controller', {
		transports: buildTransports("Controller",buildOptions())
});


//Message Config
winston.loggers.add("Message", {
		transports: buildTransports("Message",buildOptions())
});

//Device Config
winston.loggers.add("Device", {
		transports: buildTransports("Device",buildOptions())
});



module.exports = function(arg) {
	return winston.loggers.get(arg);
}

