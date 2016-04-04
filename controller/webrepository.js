

var Client = require('node-rest-client').Client;

var Repository = require('./Repository.js');



var WebRepository = function() {
		
	console.log('WebRepository init');
	this.devices = new Array();
	this.zones = new Array();
	this.url = 'http://127.0.0.1:3000';
	
	this.checkForRemoteUpdate();
	
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
		if(response.statusCode != 200){
			err = data.errors;
		}
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

	var client = new Client();
	client.get(this.url+"/device", args, function (data, response) {
		var err = undefined;
		if(response.statusCode == 200){
				
				var devicesTmp = data;
				if(devicesTmp != undefined){
					this.devices = devicesTmp;
				}
				
				/*var zonesTmp = devices;
				if(zonesTmp != undefined){
					this.zones = zonesTmp;
				}
				*/
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


WebRepository.prototype.savePersistantDevice = function(device, result , error){
	
	console.log("WebRepository -> savePersistantDevice");
	
	var args = {
		data: device,
		headers: { "Content-Type": "application/json" }
	};

	var client = new Client();
	client.post(this.url+"/device", args, function (data, response) {
		var err = undefined;
		if(response.statusCode == 200){
				result(this.devices, data);
		}else{
			error(data.errors);
		} 
	}).on('error', function (err) {
		error(data.errors);
	});

};


module.exports = WebRepository; 





