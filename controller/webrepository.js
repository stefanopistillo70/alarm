
"use strict";

var logger = require('./logger.js')('WebRepository');
var Repository = require('./Repository.js');

var Client = require('node-rest-client').Client;
var client = new Client();

class WebRepository extends Repository{
	
	constructor(){	
		super();
		logger.info('WebRepository init');
		this.url = 'http://127.0.0.1:3000';
		
		this.checkForRemoteUpdate(this.devices, this.url);
		this.client = new Client();
	}
	
	
	savePersistantEvent(event, callback){
	
		logger.info('savePersistantEvent');
		
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
	
	checkForRemoteUpdate(devices,url){
		
		logger.info('CHECK Web remote update :'+devices.length);
		
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
				logger.error(data.errors);
				setTimeout(WebRepository.prototype.checkForRemoteUpdate.bind(this,devices,url),10000);
			} 
		};

		client.get(url+"/device", args, onResponseEvent).on('error', function (err) {
			logger.log('error',data.errors);
			setTimeout(WebRepository.prototype.checkForRemoteUpdate.bind(this,devices,url),10000);
		});
					
	}

	
	savePersistantDevice(device, result , error){
		
		logger.info("WebRepository -> savePersistantDevice");
				
		var args = {
			data: device,
			headers: { "Content-Type": "application/json" }
		};

		var devices = this.devices;
		
		var onResponseEvent = function(data, response) {
			if(response.statusCode == 200){
					result(devices,data);
			}else{
				error(data.errors);
			} 
		};
		
		client.post(this.url+"/device", args, onResponseEvent).on('error', function (err) {
			error(err);
		});

	};
	
	
	
	saveConfig(id,config,result,error){

		logger.info("WebRepository -> save Config");
		
				
		var args = {
			data: config,
			headers: { "Content-Type": "application/json" }
		};

		
		var onResponseEvent = function(data, response) {
			if(response.statusCode == 200){
				result(data);
			}else{
				error(data.errors);
			} 
		};
		
		client.put(this.url+"/config/"+id, args, onResponseEvent).on('error', function (err) {
			error(err);
		});
	}
	
	getConfig(result,error){

		logger.info("WebRepository -> get Config");
				
		var args = {
			headers: { "Content-Type": "application/json" }
		};

		
		var onResponseEvent = function(data, response) {
			if(response.statusCode == 200){
				result(data);
			}else{
				error(data.errors);
			} 
		};
		
		client.get(this.url+"/config", args, onResponseEvent).on('error', function (err) {
			error(err);
		});
	}

};


module.exports = WebRepository; 





