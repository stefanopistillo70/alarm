
var assert = require('assert');
var mongoose = require('mongoose');
var SensorLog = require('../../domain/sensorLog');


describe('SensorLog', function() {
	
	before(function (done) {
		mongoose.connect('mongodb://127.0.0.1:27017/MySensorsDb', done);
	});
	
	var sensorLog = new SensorLog({
	  node: 'NODE1',
	  sensor: 'SEN1',
	  cmd: 'INTERNAL',
	  ack: true,
	  type: 'REQ_ID'
	});
			
	describe('insert value', function () {
		
		it('insert1',function(done){

			sensorLog.save(function(err){
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
			SensorLog.find({}, function(err, sensorLogs) {
				if (err) throw err;
				//console.log(sensorLogs);
				assert.equal(sensorLogs.length,1);
				done();
			});
		});
	});

	describe('get list', function () {
	});
});




