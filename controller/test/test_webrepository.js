
var assert = require('assert');
var WebRepository = require('../webrepository');


describe('WebRepository', function() {
	
	before(function (done) {
		done();
	});
	
	var webrepository = new WebRepository();
			
	describe('event', function () {
		
		it('add event',function(done){
			var event = {device_id : 1, sensor_id: 0, event : "evento1"}
			
			webrepository.addEventLog(event);
			done();
		});
	});

});




