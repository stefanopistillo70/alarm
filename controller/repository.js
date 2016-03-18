

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

var Repository = function() {
	
	this.devices = [];
	this.zones = [];
	
	console.log('Repository init');
	
	this.checkForRemoteUpdate();
			
};

Repository.Technology = { NRF : 0, T433 : 1};
Repository.DeviceType = { RC : 0, SENSOR : 1};


Repository.prototype.getDevice = function(deviceId){
		
		function exists(element) {
			var ret = false;
			if(deviceId === element.id) ret = true;
			else ret = false;
			return ret;
		};
		
		var device = this.devices.find(exists);		
		return device;
};


Repository.prototype.getSensor = function(sensorId){
		
		function exists(element) {
			var ret = false;
			if(sensorId === element.id) ret = true;
			else ret = false;
			return ret;
		};
		
		var sensor = this.sensor.find(exists);		
		return sensor;
};


Repository.prototype.getFreeDeviceID = function(){
	var nextDeviceId = 0;
	for(var i=0, len = this.devices.length; i < len; i++){
		if(this.devices[i].id > nextDeviceId ) nextDeviceId = this.devices[i].id;
	};	
	return ++nextDeviceId;
}

Repository.prototype.buildNewDevice = function(technology){
		
		var deviceId = this.getFreeDeviceID();
		var device = new Device(deviceId,"","",technology,[]);
		this.devices.push(device);
		return device;
};




Repository.prototype.addEventLog = function(event_in){
		
		var deviceName = '';
		var sensorName = '';
		
		if(event_in.deviceId) {
			var device = this.getDevice(event_in.deviceId);
			console.log(device);
			deviceName = device.name;
		}
		
		if(event_in.sensorId) {
			var sensor = this.getSensor(event_in.sensorId);
			sensorName = sensor.name;
		}
		
		var event = {device: deviceName,}
		
		console.log('Event -> device : '+deviceName+'   sensor : '+sensorName+'      '+event_in.event);
		
};


Repository.prototype.checkForRemoteUpdate = function(){
	
	console.log('Start remote update');
	var devicesTmp = this.getDevices();
	if(devicesTmp != undefined){
		this.devices = devicesTmp;
	}
	
	var zonesTmp = this.getDevices();
	if(zonesTmp != undefined){
		this.zones = zonesTmp;
	}
	console.log(this.devices);
	setTimeout(Repository.prototype.checkForRemoteUpdate.bind(this),10000);
}

Repository.prototype.getDevices = function(){
	return this.devices;
}

Repository.prototype.getZones = function(){
	
}



Repository.createZone = function(){
	return new Zone();	
}


module.exports = Repository; 





