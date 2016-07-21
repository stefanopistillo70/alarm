

var logger = require('./config/logger.js')('Controller');
var MYSP_15 = require('./mysp_15.js');
var Protocol_433 = require('./protocol_433.js');
var Webrepository = require('./webrepository');



var controller = {}
controller.repository;



controller.start = function(){
	
	logger.log('info','Start');

	controller.repository = new Webrepository();
	
	var mysp_15 = new MYSP_15(controller.repository);
	var protocol_433 = new Protocol_433(controller.repository);
	
	//Select gateway comunication type
	var GW;
	//var gw_type = "i2c";
	var gw_type = "serial";
	if(gw_type === 'test') GW = require('./test/sim_gateway.js');
	else if(gw_type === 'serial') GW = require('./serial_gateway.js');
	else if(gw_type === 'i2c') GW = require('./i2c_gateway.js');
	
	//var gateway_433 = new GW(protocol_433,'\\\\.\\COM10',9600);
	var gateway_433 = new GW(protocol_433);
	//var gateway_NRF = new GW(mysp_15,'\\\\.\\COM10',115200);


	
	controller.repository.waitForInit(function(err){
		controller.repository.getRemoteUpdate(function(){
			logger.log('info','Remote Update DONE.');
			//TODO uncomment
			controller.repository.checkForRemoteUpdate();
			
			//controller.repository.uploadFile();
		});
	});	
	
	//TODO uncomment
	controller.checkForZoneAlarm();

}

var deviceIdAlarm = -1;

controller.checkForZoneAlarm = function() {
	
	logger.info('Check for Zone alarm');
	var zones = controller.repository.zones;
	logger.info("Zones found : "+zones.length);
		
	zones.forEach(function(zone) {
		logger.info("Check zone : "+zone.name+"   armed : "+zone.armed);
		if(zone.armed){
			
			zone.devices.forEach(function(device) {
					logger.info("Check device : "+device.id);
					device = controller.repository.getDevice(device.id);
					logger.debug(device);
					if(device.events.length > 0){
						logger.info("Device events : "+(device.events.length));
						if((device.events[device.events.length-1]) && (device.events[device.events.length-1].date)){
							var d = device.events[device.events.length-1].date;
							//console.log(d);
							var dateEvent = Date.parse(d);
							//console.log(dateEvent);
							
							var now = new Date();
							logger.info("Time to event : "+(now.getTime() - dateEvent));
							if((now.getTime() - dateEvent) < (60 * 1000)){ 
								deviceIdAlarm = device.id;
								controller.fireAlarm(device.name);
							} else{
								if(deviceIdAlarm == device.id){
									deviceIdAlarm = -1;
									controller.stopFireAlarm();
								}
							}
						}
					}
			});
		}
	});
	
	setTimeout(controller.checkForZoneAlarm,10000);
}

controller.fireAlarm = function(deviceName){
	
	if(controller.repository.status.alarm == false){
	
		logger.error("*********** FIRE ALARM !!!!!! *********");
		
		var msg = {};
		msg.level = "alarm";
		msg.message = "Alarm is Firing : "+deviceName;
		controller.repository.savePersistantMessage(msg, function(){
			logger.info('Message Sent');	
			controller.repository.status.alarm = true;
		});
	}else{
		logger.error("*********** ALARM IS FIRING !!!!!! *********");
	}
} 

controller.stopFireAlarm = function(){
	
	if(controller.repository.status.alarm == true){
	
		logger.error("*********** STOP FIRE ALARM !!!!!! *********");
		controller.repository.status.alarm = false;
		
		var msg = {};
		msg.level = "alarm";
		msg.message = "Stop Alarm";
		controller.repository.savePersistantMessage(msg, function(){
			logger.info('Message Sent');	
		});
	}
} 


controller.start();



