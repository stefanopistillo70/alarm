
var app = angular.module('DomusGuard', ['ngRoute','ui.bootstrap','sensorLogControllers','pollServices']);

app.config(['$routeProvider', function($routeProvider) {
            $routeProvider.
				when('/sensorLogs', { templateUrl: 'partials/list.html', controller: 'SensorLogList' }).
				otherwise({ redirectTo: '/sensorLogs' });
          }]);