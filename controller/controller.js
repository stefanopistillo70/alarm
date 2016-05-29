
//process.stdin.resume();

var logger = require('./logger.js')('Controller');
var serial_gateway = require('./serial_gateway.js');
var MYSP_15 = require('./mysp_15.js');
var Webrepository = require('./webrepository');


/**************************
*
*	Handle exit with CTR+C
*
**************************/
/*function exitHandler() {
	console.log('Exit ....');
	var msg = {};
	msg.level = "info";
	msg.message = "Controller shutdown.";
	controller.repository.savePersistantMessage(msg, function(){
		logger.info('Message shutdown Sent.');		
		process.exit(2);		
	});
	
	console.log('Done');
	
}
process.on('SIGINT', exitHandler.bind());
*/



var controller = {}
controller.repository;



controller.start = function(){
	
	logger.log('info','Start');

	controller.repository = new Webrepository();
	
	var mysp_15 = new MYSP_15(controller.repository);
	var sg = serial_gateway(mysp_15);

	/*
	controller.repository.waitForInit(function(err){
		controller.repository.getRemoteUpdate(function(){
			logger.log('info','Remote Update DONE.');
			controller.repository.checkForRemoteUpdate();
		});
	});
	*/
	
	//controller.checkForZoneAlarm();

	//controller.repository.addNewNode(Repository.createNode(1,"node1"));
	//controller.repository.addNewNode(Repository.createNode(2,"node2"));

}

controller.checkForZoneAlarm = function() {
	
	logger.log('info','Check for Zone alarm');
	var zones = controller.repository.zones;
	logger.info("Zones found : "+zones.length);
		
	zones.forEach(function(zone) {
		logger.log('info',"Check zone : "+zone.name);
		zone.devices.forEach(function(node) {
				logger.log('info',"Check node : "+node.name);
		});
	});
	
	setTimeout(controller.checkForZoneAlarm,10000);
}


controller.start();



