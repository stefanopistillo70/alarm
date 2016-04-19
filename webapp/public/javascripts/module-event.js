var dgModuleEvent = angular.module('dgModuleEvent', ['ngResource']);

dgModuleEvent.controller('EventCtrl', ['$scope', 'EventService', function($scope, EventService) {
//sensorLogControllers.controller('SensorLogList', ['$scope', '$http', function($scope, $http) {
		
		//var result = SensorLog.query();
		//console.log("SENSORS ->"+result);
		
		/*$http.get('sensorLog').success(function(data) {
				console.log("Data->"+data);
				var p = JSON.parse(data);
				console.log("Data->"+p);
			  $scope.sensorLog = JSON.parse(data);
		});
*/
		var eventLogQuery = EventService.query().$promise;
		
		eventLogQuery.then(function(response) {
			if(response.result){
				$scope.eventLog = response.result
			}
		},
		function(reason) {
			  console.log('Failed eventLogQuery: ' + reason);
		});
		
}]);


dgModuleEvent.factory('EventService', ['$resource',
  function($resource){
	console.log("Service get Event");  
	var response = $resource(apiVer+'eventLog', {}, {
              query: { method: 'GET', params: {} }
    });
    return response;
}]);

