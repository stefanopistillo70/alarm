

var Repository = require('./Repository.js');


var WebRepository = function() {
	
	console.log('WebRepository init');
		
};

WebRepository.prototype = Repository.prototype;

module.exports = WebRepository; 





