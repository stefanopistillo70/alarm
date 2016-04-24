
var apiVer = "/api/1.0/";

var app = angular.module('DomusGuard', ['ngRoute', 'ngCookies', 'dgModuleDevice','dgModuleEvent','dgModuleConfig','dgModuleZone','dgModuleLogin']);

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


//Inject token in each request
app.factory('sessionInjector', ['$log', '$cookies', function($log, $cookies) {  
    var sessionInjector = {
        request: function(config) {
			
			var token = $cookies.get('token');
			var token_expire_at = $cookies.get('token_expire_at');
			var refresh_token = $cookies.get('refresh_token');
			var now = (new Date()).getTime();
			if((token_expire_at - now) > 0) config.headers['x-access-token'] = token;
			else{
				console.log("refresh token");
				
				var data = "refresh_token="+refresh_token;
				
				var xhttp = new XMLHttpRequest();
				xhttp.open("POST", apiVer+"auth/refresh", true);
				xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhttp.send(data);
				
				/*refreshTokenPost = LoginServiceLocation.refreshToken(data).$promise;

				refreshTokenPost.then(function(response) {
					if (response.result) {
					console.log(response.result);
					}
							
				}, function(reason) {
					console.log('Failed Login insert Code: ' + reason);
				});				
				*/
			}

            return config;
        }
    };
    return sessionInjector;
}]);
app.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('sessionInjector');
}]);
