

var fs = require("fs")
var vm = require('vm')
console.log("Start");

vm.runInThisContext(fs.readFileSync(__dirname + "/sensor.js"))
vm.runInThisContext(fs.readFileSync(__dirname + "/gateway.js"))
//require('./sensor.js').sensor();

var msg = gateway.parseMsg("12;6;0;0;3;My Light\n");
console.log("MSG -> " + msg.toString());

//var s = new Sensor(-1,"prova");
//s.name = "prova2";
//console.log("name: " + s.name);
//console.log(s);


var controller = {

	//gwPort : '\\\\.\\COM4',
	gwPort : '/dev/pts/4',
	gwBaud : 115200,
 

/*
	var dbc = require('mongodb').MongoClient;
	dbc.connect('mongodb://' + dbAddress + ':' + dbPort + '/' + dbName, function(err, db) {
	if(err) {
		console.log('Error connecting to database at mongodb://' + dbAddress + ':' + dbPort + '/' + dbName);
		return;
	}
	console.log('Connected to database at mongodb://' + dbAddress + ':' + dbPort + '/' + dbName);
	db.createCollection('node', function(err, collection) { });
	db.createCollection('firmware', function(err, collection) { });
	
*/	
	start : function(){
		var SerialPort = require('serialport').SerialPort;
		gw = new SerialPort(this.gwPort, { baudrate: this.gwBaud }, false);
		
		gw.open();
		gw.on('open', function() {
			console.log('connected to serial gateway at ' + this.gwPort);
		}).on('data', function(rd) {
			console.log('DATA ->'+rd.toString());
			//appendData(rd.toString(), db, gw);
			var msg = gateway.parseMsg(rd.toString());
			
		}).on('end', function() {
			console.log('disconnected from gateway');
		}).on('error', function(error) {
			console.log('failed to open: '+error);
			console.log('trying to reconnect');
			setTimeout(function(){gw.open()}, 5 * 1000);
			//gw.open();
		});
	}
};

controller.start();

