
var assert = require('assert');
var mongoose = require('mongoose');
var Config = require('../../domain/config');


describe('Config', function() {
	
	before(function (done) {
		mongoose.connect('mongodb://127.0.0.1:27017/MySensorsDb', done);
	});
	
	var configDefault = new Config({
	  enableNewDevice: 'false'
	});
	
	describe('insert value', function () {
		
		it('insert1',function(done){
			
			Config.count({}, function (err, count) {
				if (err) {
					console.log(err);
					throw err;
				} else {
					console.log('Count :'+count);
					if(count == 0 ) configDefault.save();
					done();
				}
			});

		});
	});

			
	describe('update value', function () {
		
		it('update enableNewDevice true',function(done){	
			var update = { 'enableNewDevice': true };
			var opts = { strict: true };
			Config.update({}, update, opts, function(error) {
				if(error) throw new Error(error);
				Config.find({}, function(err, config) {
					if (err) throw err;
					assert.equal(config[0].enableNewDevice,true);
					done();
				});
			  
			});			
		});
		
		it('update enableNewDevice false',function(done){	
			var update = { 'enableNewDevice': false };
			var opts = { strict: true };
			Config.update({}, update, opts, function(error) {
				if(error) throw new Error(error);
				Config.find({}, function(err, config) {
					if (err) throw err;
					assert.equal(config[0].enableNewDevice,false);
					done();
				});
			  
			});			
		});

		
	});

	describe('find value', function () {
		it('find1',function(done){
			Config.find({}, function(err, devices) {
				if (err) throw err;
				assert.equal(devices.length,1);
				done();
			});
		});
	});

});




