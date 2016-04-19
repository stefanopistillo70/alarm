
var apiVer = "/api/1.0/";

var app = angular.module('DomusGuard', ['ngRoute','dgModuleDevice','dgModuleEvent','dgModuleConfig','dgModuleZone','dgModuleLogin']);

app.config(['$routeProvider', function($routeProvider) {
            $routeProvider.
				when('/events', { templateUrl: 'partials/events.html', controller: 'EventCtrl' }).
				when('/devices', { templateUrl: 'partials/devices.html', controller: 'DeviceCtrl' }).
				when('/zones', { templateUrl: 'partials/zones.html', controller: 'ZoneCtrl' }).
				when('/login', { templateUrl: 'partials/login.html' }).
				otherwise({ redirectTo: '/' });
          }]);


		  
//Intercept authenticator error 403 

app.factory('myInterceptor', ['$log', '$q','$location', function ($log, $q, $location){

    var myInterceptor = {
		'request': function(config) {
			  // do something on success
			  $log.debug('REQUEST ->'+config.url);
			  return config;
			},

    // optional method
	   'requestError': function(rejection) {
		  // do something on error
		  $log.debug('REQUEST ERROR');
		  if (canRecover(rejection)) {
			return responseOrNewPromise
		  }
		  return $q.reject(rejection);
		},



		// optional method
		'response': function(response) {
		  // do something on success
		  $log.debug('RESPONSE ->');
		  return response;
		},

		// optional method
	   'responseError': function(rejection) {
		   $log.debug('RESPONSE ERROR');
			if (rejection.status === 403) {
				$log.debug('REDIRECT');
				$location.url('login');
			}
			return $q.reject(rejection);
	   }
	};

    return myInterceptor;
}]);

app.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('myInterceptor');
}]);



app.factory('sessionInjector', ['$log', '$rootScope', function($log, $rootScope) {  
    var sessionInjector = {
        request: function(config) {
			if ($rootScope.auth){
				if ($rootScope.auth.google) {
					$log.debug('token injected');
					$log.debug($rootScope.auth.google);
					config.headers['x-access-token'] = $rootScope.auth.google.access_token;
				}
			}
            return config;
        }
    };
    return sessionInjector;
}]);
app.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('sessionInjector');
}]);
