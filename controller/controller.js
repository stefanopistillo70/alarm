

var controller = {}

controller.repository ;

controller.start = function(){
	
	console.log("Start");

	var gateway = require('./gateway.js');

	var g = gateway.getInstance();
	console.log(g);

	//var msg = gateway.parseMsg("12;6;0;0;3;My Light\n");
	//console.log("MSG -> " + msg.toString());


	var Repository = require('./Repository.js');
	controller.repository = new Repository();
	
	
	controller.checkForZoneAlarm();

	controller.repository.addNewNode(Repository.createNode(1,"node1"));
	controller.repository.addNewNode(Repository.createNode(2,"node2"));

}

controller.checkForZoneAlarm = function() {
	
	console.log('Check for Zone alarm');
	var zones = controller.repository.zones;
	
	zones.forEach(new function(){
		
	});
	
	setTimeout(controller.checkForZoneAlarm,10000);

}

controller.start();



