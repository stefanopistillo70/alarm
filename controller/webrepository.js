
/*****************************************
*
*	Handle security comunication with webapp 
*
*****************************************/


"use strict";

var fs = require('fs');
var uuid = require('node-uuid');
var logger = require('./config/logger.js')('WebRepository');
var Repository = require('./repository.js');

var Client = require('node-rest-client').Client;
var client_options = { connection: {
		rejectUnauthorized : false
	}
};

var client = new Client(client_options);

var sysConfig = require('config');
var webConfig = sysConfig.get('webConfig');

var apiVersion = "api/1.0";
var url = webConfig.url+apiVersion;


/*****************************************
*
*	Common structure 
*
*****************************************/
var controllerInfo = {};
var systemIsRegistered = false;
const timeoutCheckForUpdate = 60000;



/***************************************
*
*	Read the config file controller.json
* 
****************************************/
var readControllerInfo = function(callback){
	logger.log('info',"Read controller.json from disk");
	fs.readFile('config/controller.json', 'utf8', function (err,data) {
	  callback(err,data);
	});
}

/***************************************
*
*	Save the config file controller.json
* 
****************************************/
var saveControllerInfo = function(data,callback){
	logger.log('info',"Save controller.json on disk");
	fs.writeFile('config/controller.json', JSON.stringify(data), function (err) {
	  callback(err);
	});	
}


/***************************************
*
*	Register the controllerID on web
* 
****************************************/	
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
	
	logger.debug("Refresh Token...");
		
	var args = {
		data: { refresh_token: controllerInfo.refresh_token },
		headers: { "Content-Type": "application/json" }
	};
		
	var onResponseEvent = function(data, response) {
		if(response.statusCode == 200){
				logger.debug("Response arrived - save  on disk");
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
			callback(data.errors);
		} 
	};
		
	client.post(url+"/auth/refresh", args, onResponseEvent).on('error', function (err) {
		logger.error("Connection problem for "+err.address+":"+err.port+" -> "+ err.code);
		callback(err);
	});

} 


var ready = function(){
	logger.log("info","System is registered with webapp");
	systemIsRegistered = true;
};


/***************************************
*
*	THE first method, Initialize common structure
* 
****************************************/
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





/********************************************
*
*	Extension Class of Repository
*
*********************************************/
class WebRepository extends Repository{
	
	constructor(){	
		super();		
	}
	
	/***************************************
	*
	*	Wait for initialization of common structure
	* 
	****************************************/
	waitForInit(callback){
		logger.info('Wait For Init');
		
		var webRep = this;
		
		if(systemIsRegistered){
			logger.info('WebRepository init');
			
			var msg = {};
			msg.level = "info";
			msg.message = "Controller startup";
			webRep.savePersistantMessage(msg, function(){
				logger.info('Message Sent');	
				callback();
			});
		}else{
			setTimeout(WebRepository.prototype.waitForInit.bind(webRep,callback),5000);
		}
	}
	

	/*****************************************
	*
	*	Save Event on remote Web
	*
	*****************************************/
	savePersistantEvent(event, callback){
	
		logger.info('Save Event');
		
		this.checkCommonHeaders(function(){
			var args = {
				data: { event },
				headers: { "Content-Type" : "application/json", "x-access-token" : controllerInfo.token }
			};

			client.post(url+"/eventLog", args, function (data, response) {
				var err = undefined;
				if(response.statusCode != 200){
					err = data.errors;
				}else{
					logger.info('Event successful saved');
					WebRepository.prototype.checkForRemoteUpdate(false);
				}
				callback(err);
			}).on('error', function (err) {
				callback(err);
			});
		});
	}
	
	
	/*****************************************
	*
	*	Save Message on Remote Web
	*
	*****************************************/
	savePersistantMessage(message, callback){
	
		logger.info('Save Message');
		
		this.checkCommonHeaders(function(){
			var args = {
				data: { message },
				headers: { "Content-Type" : "application/json", "x-access-token" : controllerInfo.token }
			};

			logger.info('Sending Message...');
			client.post(url+"/message", args, function (data, response) {
				var err = undefined;
				if(response.statusCode != 200){
					err = data.errors;
				}
				callback(err);
			}).on('error', function (err) {
				callback(err);
			});
		});
	}

	/*****************************************
	*
	*	Check for any changes on Web
	*
	*****************************************/	
	checkForRemoteUpdate(loop){
		
		logger.info('CHECK Web remote update');
		
		var webRep = this;
		
		WebRepository.prototype.checkCommonHeaders(function(){
			var args = {
				headers: { "Content-Type" : "application/json", "x-access-token" : controllerInfo.token }
			};

			var onResponseEvent = function(data, response) {
				var err = undefined;
				if(response.statusCode == 200){		
						if(data.result.hasNewUpdates) {
							logger.info('New updates');
							webRep.getRemoteUpdate(function(){
								logger.log('info','Remote Update DONE.');
							});
						};
						if(loop) setTimeout(WebRepository.prototype.checkForRemoteUpdate.bind(webRep,true),timeoutCheckForUpdate);
				}else{
					logger.error(data.errors);
					if(loop) setTimeout(WebRepository.prototype.checkForRemoteUpdate.bind(webRep,true),timeoutCheckForUpdate);
				};
			};

			client.get(url+"/controller", args, onResponseEvent).on('error', function (err) {
				logger.error("Connection problem for "+err.address+":"+err.port+" -> "+ err.code);
				if(loop) setTimeout(WebRepository.prototype.checkForRemoteUpdate.bind(webRep,true),timeoutCheckForUpdate);
			});
		});	
	}
	
	/*****************************************
	*
	*	Download update Zone 
	*
	*****************************************/	
	getRemoteUpdate(callback){

		logger.info('Get Web remote update');
		var webRep = this;
		
		webRep.checkCommonHeaders(function(){
			
			var args = {
				headers: { "Content-Type" : "application/json", "x-access-token" : controllerInfo.token }
			};

			var onResponseEventDevice = function(data, response) {
				logger.info('Device response arrived.');
			
				if(response.statusCode == 200){		
						webRep.devices = data.result;
						console.log(webRep.devices);
				}else{
					logger.error(data.errors);
				}
				callback();
			};

			var onResponseEventZone = function(data, response) {
				logger.info('Zone response arrived.');
			
				if(response.statusCode == 200){		
						webRep.zones = data.result;
						console.log(webRep.zones);
						client.get(url+"/device", args, onResponseEventDevice).on('error', function (err) {
							logger.error("Connection problem for "+err.address+":"+err.port+" -> "+ err.code);
							callback();
						});
				}else{
					logger.error(data.errors);
				}
			};
			
			

			

			client.get(url+"/zone", args, onResponseEventZone).on('error', function (err) {
				logger.error("Connection problem for "+err.address+":"+err.port+" -> "+ err.code);
				callback();
			});
			
			

		});	
	}


	savePersistantDevice(device, callback){
		
		logger.info("WebRepository -> savePersistantDevice");

		var webRep = this;
		
		webRep.checkCommonHeaders(function(){
			
			var args = {
				data: { device: device },
				headers: { "Content-Type" : "application/json", "x-access-token" : controllerInfo.token }
			};

			var onResponseEvent = function(data, response) {
				logger.info('Device response arrived.');
			
				if(response.statusCode == 200){	
						console.log("OK");
						console.log(data.result);
						callback(data.result);
				}else{
					callback(undefined,data.errors);
				}
			};

			client.post(url+"/device", args, onResponseEvent).on('error', function (err) {
				logger.error("Connection problem for "+err.address+":"+err.port+" -> "+ err.code);
				callback();
			});
		});	

	};
	
	savePersistantSensor(deviceId, sensor, callback){
		logger.info("WebRepository -> savePersistantSensor");

		var webRep = this;
		
		webRep.checkCommonHeaders(function(){
			
			var args = {
				data: { deviceId: deviceId, sensor : sensor },
				headers: { "Content-Type" : "application/json", "x-access-token" : controllerInfo.token }
			};

			var onResponseEvent = function(data, response) {
				logger.info('Device response arrived.');
			
				if(response.statusCode == 200){	
						console.log("OK");
						//console.log(data.result);
						callback(data.result);
				}else{
					callback(undefined,data.errors);
				}
			};

			client.post(url+"/device/"+deviceId+"/sensor/"+sensor.id, args, onResponseEvent).on('error', function (err) {
				logger.error("Connection problem for "+err.address+":"+err.port+" -> "+ err.code);
				callback();
			});
		});	
	};
	
	
	
	savePersistantSensorValue(deviceId, sensorId, value, callback){
		logger.info("WebRepository -> savePersistantSensorValue");

		var webRep = this;
		
		var sensor = { id : sensorId, value : value};
				
		webRep.checkCommonHeaders(function(){
			
			var args = {
				data: { deviceId: deviceId, sensor : sensor },
				headers: { "Content-Type" : "application/json", "x-access-token" : controllerInfo.token }
			};

			var onResponseEvent = function(data, response) {
				logger.info('Save value arrived');
			
				if(response.statusCode == 200){	
						console.log("OK");
						//console.log(data.result);
						callback(data.result);
				}else{
					logger.error(data.errors);
					callback(undefined,data.errors);
				}
			};

			client.put(url+"/device/"+deviceId+"/sensor/"+sensorId, args, onResponseEvent).on('error', function (err) {
				logger.error("Connection problem for "+err.address+":"+err.port+" -> "+ err.code);
				callback();
			});
		});	
	};
	
	savePersistantBatteryLevel(deviceId, batteryLevel, callback){
		logger.info("WebRepository -> savePersistantBatteryLevel "+deviceId);
		var webRep = this;
						
		webRep.checkCommonHeaders(function(){
			
			var args = {
				data: { 'id' : deviceId, 'batteryLevel' : batteryLevel },
				headers: { "Content-Type" : "application/json", "x-access-token" : controllerInfo.token }
			};

			var onResponseEvent = function(data, response) {
				logger.info('Save value arrived');
			
				if(response.statusCode == 200){	
						console.log("OK");
						//console.log(data.result);
						callback(data.result);
				}else{
					logger.error(data.errors);
					callback(undefined,data.errors);
				}
			};

			client.put(url+"/device/"+deviceId, args, onResponseEvent).on('error', function (err) {
				logger.error("Connection problem for "+err.address+":"+err.port+" -> "+ err.code);
				callback();
			});
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
	
	/*****************************************
	*
	*	Check token expiration 
	*
	*****************************************/
	checkCommonHeaders(callback){
		logger.debug("Check for expiration");
		var now = (new Date()).getTime();
		if((controllerInfo.expire_at - now) > 0){ 
			logger.debug("Token is valid");
			callback();
		}else{
			refreshToken(function(err){
				if(err){
					logger.error("Token refresh err.");
				} else logger.info("Token refreshed.");
				callback();
			});
		}
	}
	
	
	
	
	
	uploadFile(){
		console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$ upload FILE");
		var request = require('request');
		var sysConfig = require('config');
		var sslConf = sysConfig.get('ssl'); 
		
		var options = {
			url: url+'/file',
			headers: {
				"x-access-token" : controllerInfo.token
			},
			agentOptions: {
				cert: fs.readFileSync(sslConf.pemFile),
				key: fs.readFileSync(sslConf.keyFile),
				rejectUnauthorized: false
			}
		};
		
		fs.createReadStream('test.mp4').pipe(request.post(options)
			.on('response', function(response) {
				console.log(response.statusCode) // 200
			})		
		);
	}
	
	
	
};



module.exports = WebRepository; 





