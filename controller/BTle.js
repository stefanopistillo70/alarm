
var noble = require('noble');
var logger = require('./config/logger.js')('BTle');


var mapBLDevice = {};
var key = "domus-ABCABC";
mapBLDevice[key]  = {name : 'mydevice'};

noble.on('stateChange', function(state) {
  logger.info("on -> stateChange: " + state);

  if (state === 'poweredOn') {

        var serviceUuids = ['feaa'];

        var allowDuplicates = true;

        noble.startScanning(serviceUuids, allowDuplicates);
  } else {
    noble.stopScanning();
  }
});

noble.on('scanStart', function() {
  logger.info("on -> scanStart");
});

noble.on('scanStop', function() {
  logger.info("on -> scanStop");
});


var BTle = {

	onDiscover : function(callback) {
		noble.on('discover', function(peripheral) {
			logger.info('on -> discover: ' + peripheral);
			//console.log('btaddr ->' + peripheral.address);
			//console.log(peripheral.advertisement.serviceData[0].data.toString('hex'));

			var data = peripheral.advertisement.serviceData[0].data;
			var namespace = data.toString('ascii', 2, 12);
			var instance = data.toString('ascii',12,18);
			callback(namespace,instance);

		});	
	}

}



module.exports = BTle;

