
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
			console.log('Build node with id ->' + node.id);
			assert.notEqual(node,undefined);
			assert.equal(repository.nodes.length,1);
			done();
		});
		
		it('exists',function(done){		
			var node = repository.getNode(1);
			assert.equal(node.id,1);
			done();
		});
		
		it('add more',function(done){		
			node = repository.buildNewNode();
			assert.equal(node.id,2);
			done();
		});
		
		it('add more 2',function(done){		
			node = repository.buildNewNode();
			assert.equal(node.id,3);
			done();
		});

		
		/*it('test add sensor log',function(done){		
			repository.addSensorLog(null);
			done();
		});*/
	});

});




