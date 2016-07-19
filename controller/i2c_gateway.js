
var logger = require('./config/logger.js')('I2CGateway');
var i2c = require('i2c-bus');

var i2c_gateway = function(protocol, gwPort, gwBaud) {
	
				logger.info("RECIEVING ->"+rd.toString());
								
				protocol.onMsg(rd,function(msg){
					if(msg) logger.info("Sending response ->"+msg.toString());
					else logger.info("No response to send back");
				});
};


module.exports = i2c_gateway;


