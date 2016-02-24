
var pollServices = angular.module('pollServices', ['ngResource']);

pollServices.factory('SensorLog', ['$resource',
  function($resource){
	console.log($resource);  
	var response = $resource('sensorLog', {}, {
              query: { method: 'GET', params: {phoneId:'phones'}, isArray: true }
    });
	console.log("resp ->"+response);
    return response;

  }]);