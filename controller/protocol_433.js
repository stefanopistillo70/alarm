
var logger = require('./logger.js')('MSP15');
var Repository = require('./repository.js');

var Protocol_433 = function(repository) {
			
			
		this.onMsg = function(rd,callback){
			
			repository.buildNewDevice("433", "ggggggg", function(device,err){
				if(device){
					console.log(device);
					callback(device);
				}else{
					console.log(err);
					callback(err);
				}
			});
		};
};

module.exports = Protocol_433;


