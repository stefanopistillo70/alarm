

var Client = require('node-rest-client').Client;

var Repository = require('./Repository.js');

var client = new Client();

var WebRepository = function() {
	
	console.log('WebRepository init');
	
	this.url = 'http://127.0.0.1:3000';
	
		
};

WebRepository.prototype = Repository.prototype;

Repository.prototype.savePersistantEvent = function(event){
	
	var args = {
		data: { event },
		headers: { "Content-Type": "application/json" }
	};

	client.post(this.url+"/eventLog", args, function (data, response) {
		console.log(data);
		console.log(response);
	});
}

module.exports = WebRepository; 





