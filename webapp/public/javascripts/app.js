
var app = angular.module('DomusGuard', ['ngRoute','dgModuleDevice','dgModuleEvent','dgModuleConfig']);

app.config(['$routeProvider', function($routeProvider) {
            $routeProvider.
				when('/events', { templateUrl: 'partials/events.html', controller: 'EventCtrl' }).
				when('/devices', { templateUrl: 'partials/devices.html', controller: 'DeviceCtrl' }).
				otherwise({ redirectTo: '/' });
          }]);