
var assert = require('assert');
var Repository = require('../repository');


describe('Repository', function() {
	
	before(function (done) {
		done();
	});
	
	var repository = new Repository();
			
	describe('add Device', function () {
		
		it('not exists',function(done){		
			var device = repository.getDevice(1);
			
			device = repository.buildNewDevice('NRF');
			console.log('Build device with id ->' + device.id);
			assert.notEqual(device,undefined);
			assert.equal(repository.devices.length,1);
			done();
		});
		
		it('exists',function(done){		
			var device = repository.getDevice(1);
			assert.equal(device.id,1);
			done();
		});
		
		it('add more',function(done){		
			device = repository.buildNewDevice();
			assert.equal(device.id,2);
			done();
		});
		
		it('add more 2',function(done){		
			device = repository.buildNewDevice();
			assert.equal(device.id,3);
			done();
		});

	});
	
	
	describe('add Event log', function () {
		
		it('add',function(done){		
			var device = repository.getDevice(1);
			device.name = 'device1';
			var event = {deviceId : 1, sensorId: 0, event : "evento1"}
			var device = repository.addEventLog(event);
			done();
		});
	});


});




