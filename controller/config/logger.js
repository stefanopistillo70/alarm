
var winston = require('winston');

var myFormatter = function(module,options){
	return options.timestamp() +'\t'+ options.level.toUpperCase() +'\t['+module+']  '+ (undefined !== options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
	
};


//Default Config
var buildOptions = function(){
	
	return {
	  colorize: true,
	  timestamp: function() {
			var now = new Date();
			return now.getFullYear()+'-'+(now.getUTCMonth() + 1)+'-'+now.getUTCDate()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()+'.'+now.getMilliseconds();
	  },
	  formatter: function(options) {
			// Return string will be passed to logger. 
			return myFormatter('',options);
	  },
	  level: 'info'
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




winston.loggers.add('Controller', {
		transports: buildTransports("Controller",buildOptions())
});

winston.loggers.add('Gateway', {
		transports: buildTransports("Gateway",buildOptions())
});

winston.loggers.add('WebRepository', {
		transports: buildTransports("WebRepository",buildOptions())
});

winston.loggers.add('Repository', {
		transports: buildTransports("Repository",buildOptions())
});

winston.loggers.add('MSP15', {
		transports: buildTransports("MSP15",buildOptions())
});

winston.loggers.add('P433', {
		transports: buildTransports("P433",buildOptions())
});


winston.loggers.add('SrlGateway', {
		transports: buildTransports("SrlGateway",buildOptions())
});


module.exports = function(arg) {
	return winston.loggers.get(arg);
};

