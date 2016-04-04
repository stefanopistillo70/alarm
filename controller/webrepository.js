

var Client = require('node-rest-client').Client;

var Repository = require('./Repository.js');

var client = new Client();

var WebRepository = function() {
	
	console.log('WebRepository init');
	
	this.url = 'http://127.0.0.1:3000';
			
};

WebRepository.prototype = Repository.prototype;

WebRepository.prototype.savePersistantEvent = function(event, callback){
	
	console.log('savePersistantEvent');
	var args = {
		data: { event },
		headers: { "Content-Type": "application/json" }
	};

	client.post(this.url+"/eventLog", args, function (data, response) {
		var err = undefined;
		if(response.statusCode != 200) err = data.errors;
		callback(err);
	}).on('error', function (err) {
		callback(err);
	});
}


WebRepository.prototype.checkForRemoteUpdate = function(){
	
	console.log('Start Web remote update');
	
	
	var args = {
		headers: { "Content-Type": "application/json" }
	};

	client.get(this.url+"/device", args, function (data, response) {
		var err = undefined;
		if(response.statusCode == 200){
				
				var devicesTmp = data;
				if(devicesTmp != undefined){
					this.devices = devicesTmp;
				}
				
				var zonesTmp = this.getDevices();
				if(zonesTmp != undefined){
					this.zones = zonesTmp;
				}
				console.log(this.devices);
				setTimeout(WebRepository.prototype.checkForRemoteUpdate.bind(this),10000);

		}else{
			console.log(data.errors);
			setTimeout(WebRepository.prototype.checkForRemoteUpdate.bind(this),10000);
		} 
	}).on('error', function (err) {
		console.log(data.errors);
		setTimeout(WebRepository.prototype.checkForRemoteUpdate.bind(this),10000);
	});
	
		
}




module.exports = WebRepository; 





