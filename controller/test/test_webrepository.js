
var assert = require('assert');
var WebRepository = require('../webrepository');


describe('WebRepository', function() {
	
	before(function (done) {
		done();
	});
	
	var webrepository = new WebRepository();
	var configID;
	
	
	describe("config ", function () {
		
		it('get config',function(done){	
			webrepository.getConfig(function(configs){
				configID = configs[0]._id;
				assert.equal(configs[0].enableNewDevice,false);
				done();
			});
		});
		
		
		it('update true',function(done){	
			var config = { enableNewDevice : true};
			webrepository.saveConfig(configID, config, function(response){
					webrepository.getConfig(function(configs){
						assert.equal(configs[0].enableNewDevice,true);
						done();
					});			
			});
		});
		
		it('update false',function(done){	
			var config = { enableNewDevice : false};
			webrepository.saveConfig(configID, config, function(response){
					webrepository.getConfig(function(configs){
						assert.equal(configs[0].enableNewDevice,false);
						done();
					});			
			});
		});

		
		
	});
	
	
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
		
		it('433 add new device failure',function(done){	
					
			var deviceID = "11111111110000001";
			webrepository.buildNewDevice("433",deviceID, function(device){
			},function(error){
				console.log(error);
				done();
			});			

		});
		
		
		it('433 add new device ',function(done){	
		
			var config = { enableNewDevice : true};
			webrepository.saveConfig(configID, config, function(response){
				console.log("UPDATE enableNewDevice done");
				var deviceID = "11111111110000001";
				webrepository.buildNewDevice("433",deviceID, function(device){
					assert.notEqual(device,undefined);
					assert.equal(device.id,deviceID);
					
					var config = { enableNewDevice : false};
					webrepository.saveConfig(configID, config, function(response){
						done();
					});
				});							
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




