

var logger = require('./logger.js')('Controller');
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
	var gw_type = "serial";
	//var gw_type = "test";
	if(gw_type === 'test') GW = require('./test/sim_gateway.js');
	else if(gw_type === 'serial') GW = require('./serial_gateway.js');
	else if(gw_type === 'i2c') GW = require('./i2c_gateway.js');
	
	//var gateway_433 = new GW(protocol_433,'\\\\.\\COM10',9600);
	//var gateway_433 = new GW(protocol_433);
	var gateway_NRF = new GW(mysp_15,'\\\\.\\COM10',115200);


	
	controller.repository.waitForInit(function(err){
		controller.repository.getRemoteUpdate(function(){
			logger.log('info','Remote Update DONE.');
			controller.repository.checkForRemoteUpdate();
		});
	});	
	
	//controller.checkForZoneAlarm();

}

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
							console.log(d);
							var dateEvent = Date.parse(d);
							console.log(dateEvent);
							
							var now = new Date();
							console.log((now.getTime() - dateEvent));
							if((now.getTime() - dateEvent) < 60 * 1000) controller.fireAlarm();
						}
					}
			});
		}
	});
	
	setTimeout(controller.checkForZoneAlarm,10000);
}

controller.fireAlarm = function(){
	
	logger.error("*********** ALARM IS FIRING !!!!!! *********");
} 

controller.start();



