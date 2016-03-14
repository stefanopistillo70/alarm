
var assert = require('assert');
var Repository = require('../repository');


describe('Repository', function() {
	
	before(function (done) {
		done();
	});
	
	var repository = new Repository();
			
	describe('add Node', function () {
		
		it('not exists',function(done){		
			var node = repository.getNode(1);
			
			node = repository.buildNewNode();
			
			assert.notEqual(node,undefined);
			assert.equal(repository.nodes.length,1);
			done();
		});
		
		it('exists',function(done){		
			var node = repository.getNode(1);
			
			assert.equal(node,undefined);
			done();
		});

		
		it('test add sensor log',function(done){		
			repository.addSensorLog(null);
			done();
		});
	});

});




