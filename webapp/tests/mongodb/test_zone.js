
var assert = require('assert');
var mongoose = require('mongoose');
var Device = require('../../models/device');
var Zone = require('../../models/zone');

var sysConfig = require('../config.json');
var dbConfig = sysConfig.dbConfig;

describe('Zone', function() {
	
	before(function (done) {
		mongoose.connect(dbConfig.url, done);
	});
	
	after(function() {
		mongoose.connection.close();
	});
	
	var zone = new Zone({
	  name: 'zone1',
	  armed : false
	});
			
	describe('insert value', function () {
		
		it('insert1',function(done){

			zone.save(function(err){
			if (err) {
					console.log(err);
					throw err;
				} else {
					console.log('Log Saved');
					done();
				}
			});
		});
		
		it('insert with devices',function(done){

			var device1 = new Device({
			  id: 'id1',
			  name: 'device1',
			  deviceType : 'RC',
			  technology: '433',
			  sensors : []
			});
			
			var zone = new Zone({
			  name: 'zone1',
			  armed : false,
			  devices : [device1]
			});
					
			zone.save(function(err){
			if (err) {
					console.log(err);
					throw err;
				} else {
					console.log('Log Saved');
					done();
				}
			});
		});
		
/*		it('insert failure tecnology',function(done){

				device.technology = 'tch1';
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
*/
		
	});

	describe('find value', function () {
		it('find1',function(done){
			Zone.find({}, function(err, zones) {
				if (err) throw err;
				assert.equal((zones.length-1)>0,true);
				done();
			});
		});
	});

	describe('get list', function () {
	});



	
});




