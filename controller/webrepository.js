
"use strict";

var Repository = require('./Repository.js');

var Client = require('node-rest-client').Client;



class WebRepository extends Repository{
	
	constructor(){	
		super();
		console.log('WebRepository init');
		this.url = 'http://127.0.0.1:3000';
		
		this.checkForRemoteUpdate(this.devices, this.url);
	}
	
	
	savePersistantEvent(event, callback){
	
		console.log('savePersistantEvent');
		var args = {
			data: { event },
			headers: { "Content-Type": "application/json" }
		};

		var client = new Client();
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
	
	checkForRemoteUpdate(devices,url){
		
		console.log('CHECK Web remote update :'+devices.length);
		
		var args = {
			headers: { "Content-Type": "application/json" }
		};

		
		var onResponseEvent = function(data, response) {
			var err = undefined;
			if(response.statusCode == 200){
					
					var devicesTmp = data;
					if(devicesTmp != undefined){
						devices = devicesTmp;
					}
					
					setTimeout(WebRepository.prototype.checkForRemoteUpdate.bind(this,devices,url),10000);

			}else{
				console.log(data.errors);
				setTimeout(WebRepository.prototype.checkForRemoteUpdate.bind(this,devices,url),10000);
			} 
		};

		var client = new Client();
		client.get(url+"/device", args, onResponseEvent).on('error', function (err) {
			console.log(data.errors);
			setTimeout(WebRepository.prototype.checkForRemoteUpdate.bind(this,devices,url),10000);
		});
					
	}

	
	savePersistantDevice(device, result , error){
		
		console.log("WebRepository -> savePersistantDevice");
				
		var args = {
			data: device,
			headers: { "Content-Type": "application/json" }
		};

		var client = new Client();
		var devices = this.devices;
		
		var onResponseEvent = function(data, response) {
			var err = undefined;
			if(response.statusCode == 200){
					result(devices,data);
			}else{
				error(data.errors);
			} 
		};
		
		client.post(this.url+"/device", args, onResponseEvent).on('error', function (err) {
			error(data.errors);
		});

	};

};


module.exports = WebRepository; 





