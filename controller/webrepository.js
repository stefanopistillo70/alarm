

var Repository = require('./Repository.js');


var WebRepository = function() {
	
	console.log('WebRepository init');
	
	this.url = 'http://127.0.0.1:3000';
		
};

WebRepository.prototype = Repository.prototype;

Repository.prototype.savePersistantEvent = function(event){
}

module.exports = WebRepository; 





