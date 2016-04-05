
"use strict";

var Device = function(id_in, name_in, deviceType_in, technology_in, sensors_in){
		
	this.id = "";
	this.name = "";
	this.deviceType = "";
	this.technology = "";
	this.sensors = [];
	
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
		
		console.log('Repository init');
		
		//this.checkForRemoteUpdate();
	};
	
	
	getDevice(deviceId){
		console.log("Get Device "+deviceId)
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
	
	getFreeDeviceID(){
		var nextDeviceId = 0;
		for(var i=0, len = this.devices.length; i < len; i++){
			if(this.devices[i].id > nextDeviceId ) nextDeviceId = this.devices[i].id;
		};	
		return ++nextDeviceId;
	}
	
	buildNewDevice(technology, deviceId, callback, error_cb){
	
		if(technology == "433"){
			if((deviceId == undefined) || (deviceId === "")) {
				error_cb("device id empy or undefined");
				return;
			}
			
			var device = this.getDevice(deviceId);
			if(device){
				error_cb("Device with id "+deviceId+" already exists");
				return;
			} 
			
			device = new Device(deviceId,"","",technology,[]);
			
			this.savePersistantDevice(device, 
				function(devices){
					devices.push(device);
					callback(device);
				}, 
				function(error){
					error_cb(error);
				});
		}else{
			if(deviceId == undefined) deviceId = this.getFreeDeviceID();
			else throw new Error();
			if(deviceId > 0){
				var device = new Device(deviceId,"","",technology,[]);
				this.devices.push(device);
				return device;			
			}else null;		
		}
	};
	
	
	addEventLog(event_in, callback){
		
		var deviceName = '';
		var sensorName = '';
				
		if(event_in.deviceId != '') {
			var device = this.getDevice(event_in.deviceId);
			if(device) deviceName = event_in.deviceId;
			else deviceName = device.name;			
		}
		
		if(event_in.sensorId != '') {
			var sensor = this.getSensor(device, event_in.sensorId);
			if(sensor) sensorName = sensor.name;
		}
		
		var event = {'device': deviceName, 'sensor' : sensorName, 'event' : event_in.event};
		
		console.log('Event -> device : '+deviceName+'   sensor : '+sensorName+'      '+event_in.event);
		
		this.savePersistantEvent(event,callback);
		
	};

	checkForRemoteUpdate(){
	
		console.log('Start remote update');
		var devicesTmp = this.devices;
		if(devicesTmp != undefined){
			this.devices = devicesTmp;
		}
		
		var zonesTmp = this.zones;
		if(zonesTmp != undefined){
			this.zones = zonesTmp;
		}
		console.log(this.devices);
		setTimeout(Repository.prototype.checkForRemoteUpdate.bind(this),10000);
	}

	createZone(){
		return new Zone();	
	}

	savePersistantEvent(event,callback){
		callback();
	};

	savePersistantDevice(device,callback){
		console.log("Repository -> savePersistantDevice");
		callback(this.devices);
	};
			
};


//Repository.Technology = { NRF : 0, T433 : 1};
//Repository.DeviceType = { RC : 0, SENSOR : 1};

module.exports = Repository; 





