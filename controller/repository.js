
"use strict";

var logger = require('./logger.js')('Repository');

var Device = function(id_in, name_in, deviceType_in, technology_in, sensors_in){
		
	this.id = "";
	this.name = "";
	this.deviceType = "";
	this.technology = "";
	this.sensors = [];
	this.events = [];
	
	if(id_in != undefined) this.id = id_in;
	if(name_in != undefined) this.name = name_in;
	if(deviceType_in != undefined) this.deviceType = deviceType_in;
	if(technology_in != undefined) this.technology = technology_in;
	if(sensors_in != undefined) this.sensors = sensors_in;
	
}

var Zone = function(){
	
	this.id = "";
	this.name = "";
	this.armed = false;
	this.devices = [];
	
}



class Repository {
	
	constructor(){
		this.devices = new Array();
		this.zones = [];
		logger.info('Repository init');		
	};
	
	
	getDevice(deviceId){
		logger.debug("Get Device "+deviceId);
		function exists(element) {
			var ret = false;
			if(deviceId === element.id) ret = true;
			else ret = false;
			return ret;
		};
		
		var device = this.devices.find(exists);		
		return device;
	};
	
	getSensor(device, sensorId){
		logger.info("Get Sensor deviceId : "+device.id+"   sensorId : "+sensorId);
		function exists(element) {
			var ret = false;
			if(sensorId === element.id) ret = true;
			else ret = false;
			return ret;
		};
		
		var sensors = device.sensors;
		var sensor;
		if(sensors) sensor = sensors.find(exists);		
		return sensor;
	};
	
	addSensor(deviceId, sensor, callback){
		var rep = this;
		if(deviceId == undefined){
			callback(undefined,"deviceId undefined.");
			return;
		}
		if(sensor == undefined){
			callback(undefined,"sensor undefined.");
			return;
		}
		if(sensor.id == undefined){
			callback(undefined,"sensor id undefined.");
			return;
		}
		
		logger.info("Add Sensor : "+deviceId+"   sensorId : "+sensor.id);

		var device = rep.getDevice(deviceId);
		if(device == undefined){
			callback(undefined,"deviceId not found.")
			return;
		}
				
		var sensor1 = this.getSensor(device,sensor.id);
		if(sensor1 != undefined){
			callback(undefined,"duplicate sensor.")
			return;
		}

		
		rep.savePersistantSensor(deviceId, sensor, function(sensor, error){
			if(error){
				logger.error(error);
				callback(undefined,error);
			}else{
				device.sensors.push(sensor);
				callback(device);
			}
		});
		
	}
	
	getFreeDeviceID(){
		var nextDeviceId = 0;
		for(var i=0, len = this.devices.length; i < len; i++){
			if((this.devices[i].technology === "NF24") && (this.devices[i].id > nextDeviceId )) nextDeviceId = this.devices[i].id;
		};	
		return ++nextDeviceId;
	}
	
	buildNewDevice(technology, deviceId, callback){
	
		var rep = this;
		if(technology === "433"){
			if((deviceId == undefined) || (deviceId === "")) {
				callback(undefined, "device id empty or undefined");
			} else {
				var device = rep.getDevice(deviceId);
				if(device){
					callback(undefined, "Device with id "+deviceId+" already exists");
				}else{ 
				
					device = new Device(deviceId,"","",technology,[]);
					
					rep.savePersistantDevice(device, function(devices, error){
							if(error){
								logger.error(error);
								callback(undefined,error);
							}else{
								rep.devices.push(device);
								callback(device);
							}
					});
				}
			}
		}else if(technology === "NRF24"){
			if((deviceId != undefined) && (deviceId != "")){ 
				var device = new Device(deviceId,"","",technology,[]);
				rep.savePersistantDevice(device, function(devices, error){
						if(error){
							logger.error(error);
							callback(undefined,error);
						}else{
							rep.devices.push(device);
							callback(device);
						}
				});
			}else{
				deviceId = rep.getFreeDeviceID();
				logger.info("Device ID :"+deviceId);
				if(deviceId > 0){
					var device = new Device(deviceId,"","",technology,[]);
					rep.savePersistantDevice(device, function(devices, error){
							if(error){
								logger.error(error);
								callback(undefined,error);
							}else{
								rep.devices.push(device);
								callback(device);
							}
					});	
				}else callback(undefined,"Cannot get free Device ID");				
			}
		}else callback(undefined,"Unsupported technology : "+technology);
	};
	
	
	addEventLog(event_in, callback){
		
		var deviceName = event_in.deviceId;
		var sensorName = '';
				
		if(event_in.deviceId != '') {
			var device = this.getDevice(event_in.deviceId);
			if(device != undefined){
				
				device.events.push({date: new Date()});
				
				if(device.name != '') deviceName = device.name;
				if(event_in.sensorId != '') {
					var sensor = this.getSensor(device, event_in.sensorId);
					if(sensor) sensorName = sensor.name;
				}
			} 
		}
		
		var event = {'deviceId' : event_in.deviceId, 'device': deviceName, 'sensor' : sensorName, 'event' : event_in.event};
		
		logger.info('Event -> device : '+deviceName+'   sensor : '+sensorName+'      '+event_in.event);
		
		this.savePersistantEvent(event,callback);
	};
	
	setBatteryLevel(deviceId, batteryLevel, callback){
		this.savePersistantBatteryLevel(deviceId, batteryLevel, callback)
	};
	
	setTemperature(deviceId, sensorId, temperature, callback){
		this.savePersistantTemperature(deviceId, sensorId, temperature, callback);
	};
	
	setHumidity(deviceId, sensorId, humidity, callback){
		this.savePersistantHumidity(deviceId, sensorId, humidity, callback);
	};




	/*createZone(){
		return new Zone();	
	}
*/
	savePersistantEvent(event,callback){
		callback();
	};

	savePersistantDevice(device,callback){
		logger.info("Repository -> savePersistantDevice");
		callback(device);
	};
	
	savePersistantSensor(deviceId, sensor, callback){
		logger.info("Repository -> savePersistantSensor "+deviceId);
		callback(sensor);
	};
	
	savePersistantBatteryLevel(deviceId, batteryLevel, callback){
		logger.info("Repository -> savePersistantBatteryLevel "+deviceId);
		callback(deviceId);
	};
	
	savePersistantTemperature(deviceId, sensorId, temperature, callback){
		logger.info("Repository -> savePersistantTemperature "+deviceId);
		callback(deviceId);
	};
	
	savePersistantHumidity(deviceId, sensorId, humidity, callback){
		logger.info("Repository -> savePersistantHumidity "+deviceId);
		callback(deviceId);
	};




			
};

module.exports = Repository; 





