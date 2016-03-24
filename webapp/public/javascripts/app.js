
var app = angular.module('DomusGuard', ['ngRoute','ui.bootstrap','dgControllers','dbServices']);

app.config(['$routeProvider', function($routeProvider) {
            $routeProvider.
				when('/eventLogs', { templateUrl: 'partials/events.html', controller: 'EventLogList' }).
				when('/devices', { templateUrl: 'partials/devices.html', controller: 'DeviceList' }).
				otherwise({ redirectTo: '/' });
          }]);