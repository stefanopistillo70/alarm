
var assert = require('assert');
var mongoose = require('mongoose');
var Device = require('../../models/device');


describe('Device', function() {
	
	before(function (done) {
		mongoose.connect('mongodb://127.0.0.1:27017/MySensorsDb', done);
	});
	
	after(function() {
		mongoose.connection.close();
	});
				
	describe('insert value', function () {
		
		it('insert1',function(done){
			
			
			var device = new Device({
			  id: 'id1',
			  name: 'device1',
			  deviceType : 'RC',
			  technology: '433'
			});

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
		
		it('insert failure tecnology',function(done){

				var device = new Device({
				  id: 'id1',
				  name: 'device1',
				  deviceType : 'RC',
				  technology: 'tch1'
				});

				device.save(function(err){
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
		
		
		it('insert with sensors',function(done){

				var device = new Device({
				  id: 'id1',
				  name: 'device1',
				  deviceType : 'RC',
				  technology: '433',
				  sensors : [{name: 'sens1', description : 'Sensore prova', type : 'Porta'}]
				});

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
				assert.equal((devices.length-1)>0,true);
				done();
			});
		});
	});

	describe('update', function () {
		it('update device',function(done){	
				
			var query = { 'id' : 'id1'}
			var update = { 'name': 'deviceProva' };
			var opts = { strict: true };
			Device.update(query, update, opts, function(error,raw) {
				if(error) throw new Error(error);
				console.log(raw);
				Device.find(query, function(err, devices) {
					if (err) throw err;
					assert.equal(devices[0].name,"deviceProva");
					done();
				});
			  
			});			
		});
	});
});




