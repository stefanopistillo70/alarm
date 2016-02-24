
var app = angular.module('myApp', ['sensorLogControllers','pollServices']);

app.config(['$routeProvider', function($routeProvider) {
            $routeProvider.
				when('/polls', { templateUrl: 'partials/list.html', controller: 'SensorLogList' }).
				otherwise({ redirectTo: '/polls' });
          }]);