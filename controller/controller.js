
//process.stdin.resume();

var logger = require('./logger.js')('Controller');

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

var gateway = require('./gateway.js');


var controller = {}
controller.repository;



controller.start = function(){
	
	logger.log('info','Start');
	
	//var g = gateway.getInstance();
//	console.log(g);

	//var msg = gateway.parseMsg("12;6;0;0;3;My Light\n");
	//console.log("MSG -> " + msg.toString());

	var Webrepository = require('./webrepository');
	controller.repository = new Webrepository();
	console.log(controller.repository);
	console.log(Webrepository.prototype);
	
/*	var f = function(){
		logger.log('info','OK .....');
	}
	controller.repository.waitForInit(f);
*/
	
	controller.repository.waitForInit(function(err){
		controller.repository.getRemoteUpdate(function(){
			logger.log('info','Remote Update DONE.');
		});
	});
	
	
	
	
	
	controller.checkForZoneAlarm();

	//controller.repository.addNewNode(Repository.createNode(1,"node1"));
	//controller.repository.addNewNode(Repository.createNode(2,"node2"));

}

controller.checkForZoneAlarm = function() {
	
	logger.log('info','Check for Zone alarm');
	var zones = controller.repository.zones;
	logger.info("Zones found : "+zones.length);
		
	zones.forEach(function(zone) {
		logger.log('info',"Check zone : "+zone.name);
		zone.nodes.forEach(function(node) {
				logger.log('info',"Check node : "+node.name);
		});
	});
	
	setTimeout(controller.checkForZoneAlarm,10000);
}


controller.start();



