
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
			return now.getFullYear()+'-'+now.getMonth()+'-'+now.getDay()+' '+now.getHours()+':'+now.getMinutes()+':'+now.getSeconds()+'.'+now.getMilliseconds();
	  },
	  formatter: function(options) {
			// Return string will be passed to logger. 
			return myFormatter('',options);
	  },
	  level: 'debug'
	}
};

var transport = new winston.transports.Console(buildOptions());
 
// configure default transports for all loggers in default container 
winston.loggers.options.transports = [transport];





//Control Config

var optController = buildOptions();
optController.formatter = function(options) {
        return myFormatter('Controller',options);
};

var optGateway = buildOptions();
optGateway.formatter = function(options) {
        return myFormatter('Gateway',options);
};

var optWebRepository = buildOptions();
optWebRepository.formatter = function(options) {
        return myFormatter('WebRepository',options);
};

var optRepository = buildOptions();
optRepository.formatter = function(options) {
        return myFormatter('Repository',options);
};

var optMYSP15 = buildOptions();
optMYSP15.formatter = function(options) {
        return myFormatter('MSP15',options);
};

var optSrlGateway = buildOptions();
optSrlGateway.formatter = function(options) {
        return myFormatter('SrlGateway',options);
};




winston.loggers.add('Controller', {
		transports: [new winston.transports.Console(optController)]
});

winston.loggers.add('Gateway', {
		transports: [new winston.transports.Console(optGateway)]
});

winston.loggers.add('WebRepository', {
		transports: [new winston.transports.Console(optWebRepository)]
});

winston.loggers.add('Repository', {
		transports: [new winston.transports.Console(optRepository)]
});

winston.loggers.add('MSP15', {
		transports: [new winston.transports.Console(optMYSP15)]
});

winston.loggers.add('SrlGateway', {
		transports: [new winston.transports.Console(optSrlGateway)]
});


module.exports = function(arg) {
	return winston.loggers.get(arg);
};

