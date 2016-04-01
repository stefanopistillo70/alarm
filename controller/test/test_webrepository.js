
var assert = require('assert');
var WebRepository = require('../webrepository');


describe('WebRepository', function() {
	
	before(function (done) {
		done();
	});
	
	var webrepository = new WebRepository();
	
	describe("add device ", function () {
		
		it('event ok',function(done){
			
			webrepository.buildNewDevice(event, function(err){
				assert.equal(err,undefined);
				done();
			});
			
		});
	});

			
	describe("add event ", function () {
		
		it('event ok',function(done){
			var event = {device_id : "1", sensor_id: "0", event : "evento1"}
			
			webrepository.addEventLog(event, function(err){
				assert.equal(err,undefined);
				done();
			});
			
		});
	});

});




