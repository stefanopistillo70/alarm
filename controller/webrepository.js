

var Client = require('node-rest-client').Client;

var Repository = require('./Repository.js');

var client = new Client();

var WebRepository = function() {
	
	console.log('WebRepository init');
	
	this.url = 'http://127.0.0.1:3000';
	
		
};

WebRepository.prototype = Repository.prototype;

WebRepository.prototype.savePersistantEvent = function(event, callback){
	
	console.log('savePersistantEvent');
	var args = {
		data: { event },
		headers: { "Content-Type": "application/json" }
	};

	client.post(this.url+"/eventLog", args, function (data, response) {
		console.log(data);
		//console.log(response);
		console.log(response.statusCode);
		callback();
	}).on('error', function (err) {
		console.log('something went wrong on the request', err.request.options);
	});
}

module.exports = WebRepository; 





