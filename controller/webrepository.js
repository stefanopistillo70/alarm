
"use strict";

var fs = require('fs');
var uuid = require('node-uuid');
var logger = require('./logger.js')('WebRepository');
var Repository = require('./Repository.js');

var Client = require('node-rest-client').Client;
var client = new Client();

var apiVersion = "api/1.0";
var url = 'http://127.0.0.1:3000/'+apiVersion;

/************************

Handle security comunication with webapp 
*************************/

var controllerInfo = {};
var systemIsRegistered = false;

var readControllerInfo = function(callback){
	logger.log('info',"Read controller.json from disk");
	fs.readFile('config/controller.json', 'utf8', function (err,data) {
	  callback(err,data);
	});
}

var saveControllerInfo = function(data,callback){
	logger.log('info',"Save controller.json on disk");
	fs.writeFile('config/controller.json', JSON.stringify(data), function (err) {
	  callback(err);
	});	
}
	
var registerController = function(controllerId, callback){
	logger.log('info',"Register Controller ->"+controllerId);
		
	var args = {
		data: { controllerId: controllerId },
		headers: { "Content-Type": "application/json" }
	};
		
	var onResponseEvent = function(data, response) {
		if(response.statusCode == 200){
				logger.log('info',"Response arrived - save  on disk");
				controllerInfo.token = data.result.access_token;
				controllerInfo.expire_at = data.result.expire_at;
				controllerInfo.refresh_token = data.result.refresh_token;
				saveControllerInfo(controllerInfo, function(err){
						if (err) {
							logger.log('error',err);
							throw err;
						}
						callback();
				});
		}else{
			logger.error(data.errors);
			setTimeout(registerController.bind(this,controllerId,callback),10000);
		} 
	};
		
	client.post(url+"/auth/controller", args, onResponseEvent).on('error', function (err) {
		logger.error("Connection problem for "+err.address+":"+err.port+" -> "+ err.code);
		setTimeout(registerController.bind(this,controllerId,callback),10000);
	});
		
}


var refreshToken = function(callback){
	
	logger.log('info',"Refresh Token...");
		
	var args = {
		data: { refresh_token: controllerInfo.refresh_token },
		headers: { "Content-Type": "application/json" }
	};
		
	var onResponseEvent = function(data, response) {
		if(response.statusCode == 200){
				logger.log('info',"Response arrived - save  on disk");
				controllerInfo.token = data.result.access_token;
				controllerInfo.expire_at = data.result.expire_at;
				saveControllerInfo(controllerInfo, function(err){
						if (err) {
							logger.log('error',err);
							throw err;
						}
						callback();
				});
		}else{
			logger.error(data.errors);
			callback(data.errors)
		} 
	};
		
	client.post(url+"/auth/refresh", args, onResponseEvent).on('error', function (err) {
		logger.error("Connection problem for "+err.address+":"+err.port+" -> "+ err.code);
	});

} 



var commonHeaders = function(){
	
	var now = (new Date()).getTime();
	if((controllerInfo.expire_at - now) > 0){ 
		return { "Content-Type" : "application/json", "x-access-token" : controllerInfo.token };
	}else{
		refreshToken(function(err){
			return { "Content-Type" : "application/json", "x-access-token" : controllerInfo.token };
		});
	}

}

var ready = function(){
	logger.log("info","System is registered with webapp");
	systemIsRegistered = true;
};

//Initialize common structure
readControllerInfo(function(err, data){
	
		if (err) {
			logger.log('error',err);
			throw err;
		}

		logger.log("info","Read controller info");
		controllerInfo = JSON.parse(data);
		if(controllerInfo.controllerId == "" ){
			controllerInfo.controllerId = uuid.v4();
			logger.log("info","Generated Controller ID : "+controllerInfo.controllerId);
			saveControllerInfo(controllerInfo, function(err){
				if (err) {
					logger.log('error',err);
					throw err;
				}
				registerController(controllerInfo.controllerId, ready);
			});
			
		}else{
			logger.log("info","Controller ID : "+controllerInfo.controllerId);
			if(controllerInfo.token === ""){
				registerController(controllerInfo.controllerId, ready);
			}else{
				ready();
			}
		} 
});



class WebRepository extends Repository{
	
	constructor(){	
		super();		
		//this.checkForRemoteUpdate(this.devices, url);
		//this.client = new Client();
		this.waitForInit();	
	}
	
	waitForInit(){
		logger.info('Wait For Init');
		
		if(systemIsRegistered){
			logger.info('WebRepository init');
		}else{
			setTimeout(WebRepository.prototype.waitForInit.bind(this),10000);
		}
	}
	

	savePersistantEvent(event, callback){
	
		logger.info('Save Event');
		
		var args = {
			data: { event },
			headers: commonHeaders()
		};

		client.post(url+"/eventLog", args, function (data, response) {
			var err = undefined;
			if(response.statusCode != 200){
				err = data.errors;
			}
			callback(err);
		}).on('error', function (err) {
			callback(err);
		});
	}
	
	
	savePersistantMessage(message, callback){
	
		logger.info('Save Message');
		console.log(commonHeaders());
		
		var args = {
			data: { message },
			headers: commonHeaders()
		};

		client.post(url+"/message", args, function (data, response) {
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
			logger.log('error',err);
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
		
		client.post(url+"/device", args, onResponseEvent).on('error', function (err) {
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
		
		client.put(url+"/config/"+id, args, onResponseEvent).on('error', function (err) {
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
		
		client.get(url+"/config", args, onResponseEvent).on('error', function (err) {
			error(err);
		});
	}
	

};



module.exports = WebRepository; 





