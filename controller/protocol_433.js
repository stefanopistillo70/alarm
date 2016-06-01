
var logger = require('./logger.js')('MSP15');
var Repository = require('./repository.js');

var Protocol_433 = function(repository) {
						
		this.onMsg = function(rd,callback){
			
			var deviceId = rd;
			
			var device = repository.getDevice(deviceId);
			
			if(device){
				var event = {deviceId : deviceId, sensorId: 0, event : "Allarm"}
				repository.addEventLog(event, function(){
					callback(device);
				});
			}else{
				repository.buildNewDevice("433", rd, function(device,err){
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


