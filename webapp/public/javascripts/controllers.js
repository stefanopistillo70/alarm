var sensorLogControllers = angular.module('sensorLogControllers', []);

sensorLogControllers.controller('SensorLogList', ['$scope', 'SensorLog', function($scope, SensorLog) {
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
		
		$scope.sensorLog = SensorLog.query();
}]);




