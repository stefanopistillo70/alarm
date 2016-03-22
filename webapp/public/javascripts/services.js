
var pollServices = angular.module('pollServices', ['ngResource']);

pollServices.factory('EventLog', ['$resource',
  function($resource){
	console.log("Service get Event");  
	var response = $resource('eventLog', {}, {
              query: { method: 'GET', params: {}, isArray: true }
    });
	console.log("resp ->"+response);
    return response;

  }]);