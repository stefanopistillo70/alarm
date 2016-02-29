
var pollServices = angular.module('pollServices', ['ngResource']);

pollServices.factory('SensorLog', ['$resource',
  function($resource){
	console.log("Service get Sensor");  
	var response = $resource('sensorLog', {}, {
              query: { method: 'GET', params: {}, isArray: true }
    });
	console.log("resp ->"+response);
    return response;

  }]);