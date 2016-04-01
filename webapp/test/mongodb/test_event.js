
var assert = require('assert');
var mongoose = require('mongoose');
var EventLog = require('../../domain/eventLog');


describe('EventLog', function() {
	
	before(function (done) {
		mongoose.connect('mongodb://127.0.0.1:27017/MySensorsDb', done);
	});
	
	
	describe('insert value', function () {

		var eventLog = new EventLog();
		
		it('insert fake 1',function(done){

			eventLog.save(function(err){
				if (err) {
						console.log('Error Inserting New Data');
						if (err.name == 'ValidationError') {
							for (field in err.errors) {
								console.log(err.errors[field].message); 
							}
						}
						assert.equal(err.name,'ValidationError');
				}
				done();
			});
		});
	
		it('insert1',function(done){

			var eventLog = new EventLog({
				device: 'Device1',
				sensor: 'SEN1',
				event: 'Richiesta id'
			});
			
			eventLog.save(function(err){
				if (err) {
						console.log('Error Inserting New Data');
						if (err.name == 'ValidationError') {
							for (field in err.errors) {
								console.log(err.errors[field].message); 
							}
						}
				}
				done();
			});
		});
	});

	describe('find value', function () {
		it('find1',function(done){
			EventLog.find({}, function(err, eventLogs) {
				if (err) throw err;
				//console.log(eventLogs);
				assert.equal(eventLogs.length,1);
				done();
			});
		});
	});

	describe('get list', function () {
	});
});




