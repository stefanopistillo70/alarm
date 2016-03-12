
var assert = require('assert');
var serial_gateway = require('../serial_gateway');


describe('SerialGateway', function() {
	
	before(function (done) {
		done();
	});
	
	var sgw = serial_gateway.getInstance()
			
	describe('init', function () {
		
		it('open connection',function(done){
			var sgw = serial_gateway.getInstance();
			done();
		});
	});

});




