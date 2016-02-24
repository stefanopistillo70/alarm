
var pollServices = angular.module('pollServices', ['ngResource']);

pollServices.factory('SensorLog', ['$resource',
  function($resource){
    return $resource('sensorLog', {}, {
              query: { method: 'GET', params: {}, isArray: true }
    })
  }]);