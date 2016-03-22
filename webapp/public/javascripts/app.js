
var app = angular.module('DomusGuard', ['ngRoute','ui.bootstrap','eventLogControllers','pollServices']);

app.config(['$routeProvider', function($routeProvider) {
            $routeProvider.
				when('/eventLogs', { templateUrl: 'partials/list.html', controller: 'EventLogList' }).
				otherwise({ redirectTo: '/eventLogs' });
          }]);