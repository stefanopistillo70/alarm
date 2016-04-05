
var assert = require('assert');
var WebRepository = require('../webrepository');


describe('WebRepository', function() {
	
	before(function (done) {
		done();
	});
	
	var webrepository = new WebRepository();
	console.log(webrepository);
	
	describe("add device ", function () {

		it('433 id empty ',function(done){	
			webrepository.buildNewDevice("433","", undefined, function(err){
				assert.equal(err,"device id empy or undefined");
				done();
			});
		});
		
		it('433 id undefined ',function(done){	
			webrepository.buildNewDevice("433",undefined, undefined, function(err){
				assert.equal(err,"device id empy or undefined");
				done();
			});
		});
		
		it('433 add new device ',function(done){	
			var deviceID = "11111111110000001";
			console.log("Lenght");
			console.log(webrepository.devices.length);
			webrepository.buildNewDevice("433",deviceID, function(device){
				assert.notEqual(device,undefined);
				assert.equal(device.id,deviceID);
				assert.equal(webrepository.devices.length,1);
				done();
			});
		});

	});

		
	describe("add event ", function () {
		
		it('event ok',function(done){
			var event = {deviceId : "11111111110000001", sensorId: "0", event : "evento1"}
			
			webrepository.addEventLog(event, function(err){
				assert.equal(err,undefined);
				done();
			});
			
		});
	});
	
});




