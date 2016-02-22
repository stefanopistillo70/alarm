
var winston = require('winston');

var myFormatter = function(module,options){
	return options.timestamp() +'\t'+ options.level.toUpperCase() +' ['+module+']  '+ (undefined !== options.message ? options.message : '') +
          (options.meta && Object.keys(options.meta).length ? '\n\t'+ JSON.stringify(options.meta) : '' );
	
}


//Default Config
var options = {
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
};
var transport = new winston.transports.Console(options);
 
// configure default transports for all loggers in default container 
winston.loggers.options.transports = [transport];





//Control Config

var optController = options;
optController.formatter = function(options) {
        return myFormatter('Controller',options);
}

winston.loggers.add('Controller', {
		transports: [new winston.transports.Console(optController)]
});



module.exports = function(arg) {
	return winston.loggers.get(arg);
}

