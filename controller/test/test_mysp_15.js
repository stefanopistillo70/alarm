



var assert = require('assert');
var MYSP_15 = require('../mysp_15');
var Repository = require('../repository');

var repository = new Repository();

console.log(repository);


describe('MYSP_15', function() {
	
	before(function (done) {
		done();
	});
			
	describe('init', function () {
		
		it('test get req id',function(done){
			var mysp_15 = new MYSP_15(repository);
			mysp_15.onMsg(function(data){
				console.log('Response ->'+data);
				assert.equal(data,'255;255;3;0;4;1')
				done();
			},'255;0;3;0;3');
		});
	});

});

