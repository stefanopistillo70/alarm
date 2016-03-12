
var logger = require('./logger.js')('SrlGateway');

var serial_gateway = (function() {
	
		var instance;
		
		var gw;
		
		var response = function(data){
			
		}
		
		function init() {
			
			const gwPort = '\\\\.\\COM10';
			//var gwPort = '/dev/pts/2';
			var gwBaud = 115200;
		
			var serialport = require("serialport");
			var SerialPort = serialport.SerialPort;
			this.gw = new SerialPort(gwPort, { baudrate: gwBaud , parser: serialport.parsers.readline("\n")}, false);
		
			this.gw.open();
			this.gw.on('open', function() {
				logger.log('info','connected to serial gateway at ' + this.gwPort);
			}).on('data', function(rd) {
				logger.log('info','RECIEVING ->'+rd.toString());
								
				protocol.onMsg(rd,response);
				
			}).on('end', function() {
				logger.log('error','disconnected from gateway');
			}).on('error', function(error) {
				logger.log('error','failed to open: '+error);
				logger.log('error','trying to reconnect');
				setTimeout(function(){gw.open()}, 5 * 1000);
			});
						
			return {}
		};
		
		return {
			getInstance: function () {
		 
			  if ( !instance ) {
				logger.log('info','Initialize Serial Gataway...')  
				instance = init();
				logger.log('info','Done') 
			  }
			  return instance;
			}
		};
 
})();


module.exports = serial_gateway;


