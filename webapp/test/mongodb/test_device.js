
var assert = require('assert');
var mongoose = require('mongoose');
var Device = require('../../domain/device');


describe('Device', function() {
	
	before(function (done) {
		mongoose.connect('mongodb://127.0.0.1:27017/MySensorsDb', done);
	});
	
	var device = new Device({
	  id: 'id1',
	  name: 'device1',
	  technology: '433'
	});
			
	describe('insert value', function () {
		
		it('insert1',function(done){

			device.save(function(err){
			if (err) {
					console.log(err);
					throw err;
				} else {
					console.log('Log Saved');
					done();
				}
			});
		});
	});

	describe('find value', function () {
		it('find1',function(done){
			Device.find({}, function(err, devices) {
				if (err) throw err;
				assert.equal(devices.length,1);
				done();
			});
		});
	});

	describe('get list', function () {
	});
});




