var sensorLogControllers = angular.module('sensorLogControllers', []);


sensorLogControllers.controller('SensorLogList', ['$scope', 'SensorLog', function($scope, SensorLog) {
  $scope.prova = SensorLog.query();
}]);




