var dgControllers = angular.module('dgControllers', []);

dgControllers.controller('EventLogList', ['$scope', 'EventLog', function($scope, EventLog) {
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
		
		$scope.eventLog = EventLog.query();
}]);



dgControllers.controller('DeviceList', ['$scope', 'Device', function($scope, Device) {
		
		$scope.device = Device.query();
}]);





