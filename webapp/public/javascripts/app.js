
var app = angular.module('DomusGuard', ['ngRoute','dgModuleDevice','dgModuleEvent','dgModuleConfig','dgModuleZone']);

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
    $log.debug('$log is here to show you that this is a regular factory with injection');

    var myInterceptor = {
		'request': function(config) {
			  // do something on success
			  //$log.debug('REQUEST');
			  return config;
			},

    // optional method
	   'requestError': function(rejection) {
		  // do something on error
		  if (canRecover(rejection)) {
			return responseOrNewPromise
		  }
		  return $q.reject(rejection);
		},



		// optional method
		'response': function(response) {
		  // do something on success
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


/*
app.factory('sessionInjector', ['SessionService', function(SessionService) {  
    var sessionInjector = {
        request: function(config) {
            if (!SessionService.isAnonymus) {
                config.headers['x-session-token'] = SessionService.token;
            }
            return config;
        }
    };
    return sessionInjector;
}]);
app.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('sessionInjector');
}]);
*/