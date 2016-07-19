
var SerialPort = require("serialport");
var logger = require('./config/logger.js')('SrlGateway');

var serial_gateway = function(protocol, gwPort, gwBaud) {
	
			if(gwPort ===undefined) gwPort = '/dev/serial0';
			if(gwBaud ===undefined) gwBaud = 9600;
		
			var gw = new SerialPort(gwPort, { baudrate: gwBaud , parser: SerialPort.parsers.readline("\n"), autoOpen: false });
		
			gw.open();
			gw.on('open', function() {
				logger.info("connected to serial gateway at serial : " + gwPort+"     baund rates : "+gwBaud);
			}).on('data', function(rd) {
				logger.info("RECEIVING ->"+rd.toString());
								
				protocol.onMsg(rd,function(msg){
					if(msg) logger.info("Sending response ->"+msg.toString());
					else logger.info("No response to send back");
				});
				
			}).on('end', function() {
				logger.error("disconnected from gateway");
			}).on('error', function(error) {
				logger.error("failed to open: "+error);
				logger.error("trying to reconnect");
				setTimeout(function(){gw.open()}, 5 * 1000);
			});
						
};


module.exports = serial_gateway;


