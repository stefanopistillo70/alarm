var sensorLogControllers = angular.module('sensorLogControllers', []);

sensorLogControllers.controller('SensorLogList', ['$scope', 'SensorLog', function($scope, SensorLog) {
		console.log("SENSORS before ->"+result);
		var result = SensorLog.query();
		console.log("SENSORS ->"+result);
		$scope.prova = result;
}]);




