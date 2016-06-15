
var logger = require('./logger.js')('P433');
var Repository = require('./repository.js');

var Protocol_433 = function(repository) {
						
		this.onMsg = function(msg,callback){
			
			if(!msg.startsWith('[')){
				logger.info("msg -> "+msg);
				return;
			}
			
			var decimal = msg.substring(1, (msg.length-1));
			
			var addresscode = (decimal >> 8) & 0xFFFF;
			var commandcode = (decimal & 0xFF);
			
			logger.info("addresscode : "+addresscode+"\t commandcode : "+commandcode);
			
			var device = repository.getDevice(addresscode);
			
			if(device){
				var event = {deviceId : addresscode, sensorId: 0, event : "Allarm"}
				repository.addEventLog(event, function(err){
					if(err){
						console.log(err);
						callback(err);
					}else callback(event);
				});
			}else{
				repository.buildNewDevice("433", addresscode, function(device,err){
					if(device){
						console.log(device);
						callback(device);
					}else{
						console.log(err);
						callback(err);
					}
				});
			}
		};
};

module.exports = Protocol_433;


