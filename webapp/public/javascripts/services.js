
var dbServices = angular.module('dbServices', ['ngResource']);

dbServices.factory('EventLog', ['$resource',
  function($resource){
	console.log("Service get Event");  
	var response = $resource('eventLog', {}, {
              query: { method: 'GET', params: {}, isArray: true }
    });
	console.log("resp ->"+response);
    return response;

  }]);
  
  
 dbServices.factory('Device', ['$resource',
  function($resource){
	var response = $resource('device', {}, {
              query: { method: 'GET', params: {}, isArray: true }
    });
	console.log("resp ->"+response);
    return response;

  }]);