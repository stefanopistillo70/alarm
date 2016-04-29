
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


//Control Config

var optWeb = buildOptions();
optWeb.formatter = function(options) {
        return myFormatter('Web',options);
}

winston.loggers.add('Web', {
		transports: [new winston.transports.Console(optWeb)]
});

module.exports = function(arg) {
	return winston.loggers.get(arg);
}

