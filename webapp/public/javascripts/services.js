
var dbServices = angular.module('dbServices', ['ngResource']);

dbServices.factory('EventLog', ['$resource',
  function($resource){
	console.log("Service get Event");  
	var response = $resource('eventLog', {}, {
              query: { method: 'GET', params: {} }
    });
    return response;
  }]);
  
  
 dbServices.factory('Device', ['$resource',
  function($resource){
	var response = $resource('device:entryId', {}, {
			query: { method: 'GET', params: {} },
			post: {method:'POST'},
			update: {method:'PUT', params: {entryId: '@entryId'}},
			remove: {method:'DELETE'}
    });
    return response;

  }]);
  
  
  
 dbServices.factory('Config', ['$resource',
  function($resource){
	var response = $resource('config/:entryId', {entryId: '@entryId'}, {
			query: { method: 'GET', params: {}, isArray: true },
			post: {method:'POST'},
			update: {method:'PUT', params: {entryId: '@entryId'}},
			remove: {method:'DELETE'}
    });
    return response;

  }]);