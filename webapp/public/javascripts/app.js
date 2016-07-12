
var apiVer = "/api/1.0/";

var app = angular.module('DomusGuard', ['ngResource', 'ngRoute', 'ngCookies', 'dgModuleDevice','dgModuleEvent','dgModuleConfig','dgModuleZone','dgModuleLogin','dgModuleSystem','dgModuleWebCam','dgModuleMessage']);





app.config(['$routeProvider', function($routeProvider) {
            $routeProvider.
				when('/events', { templateUrl: 'partials/events.html', controller: 'EventCtrl' }).
				when('/devices', { templateUrl: 'partials/devices.html', controller: 'DeviceCtrl' }).
				when('/zones', { templateUrl: 'partials/zones.html', controller: 'ZoneCtrl' }).
				when('/login', { templateUrl: 'partials/login.html' }).
				when('/configuration', { templateUrl: 'partials/system.html' }).
				when('/webcam', { templateUrl: 'partials/webcam.html' }).
				when('/message', { templateUrl: 'partials/message.html' }).
				when('/', { templateUrl: 'partials/mainStatus.html' }).
				otherwise({ redirectTo: '/' });
          }]);


/*********************************
*
*	Intercept authenticator error 403 
*
********************************/
app.factory('myInterceptor', ['$log', '$q','$location','$rootScope', function ($log, $q, $location, $rootScope){

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
				$rootScope.isLoggedIn = false;
				$location.url('/login');
			}
			return $q.reject(rejection);
	   }
	};

    return myInterceptor;
}]);

app.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('myInterceptor');
}]);




/********************************
*
*	Inject token in each request
*
********************************/
app.factory('sessionInjector', ['$log', '$cookies', function($log, $cookies) {  
    var sessionInjector = {
        request: function(config) {
			
			var url = config.url;
			console.log("URL ->"+url);
			
			if(url.startsWith('/api')){
				var token = $cookies.get('token');
				var token_expire_at = $cookies.get('token_expire_at');
				var refresh_token = $cookies.get('refresh_token');
				var now = (new Date()).getTime();
				if((token_expire_at - now) > 0){ 
					console.log("inject token");
					config.headers['x-access-token'] = token;
					return config;
				}else{
					
					if(refresh_token){
						console.log("refresh token");
						var data = "refresh_token="+refresh_token;
						
						var xhttp = new XMLHttpRequest();
						xhttp.onreadystatechange = function() {
							if (xhttp.readyState == 4) {
								console.log("Respons arrived");
								var res = JSON.parse(xhttp.responseText);
								console.log(res.result);
								console.log(res.result.access_token);
								console.log(res.result.expire_at);
								$cookies.put('token', res.result.access_token);
								$cookies.put('token_expire_at',res.result.expire_at);
								var new_token = $cookies.get('token');
								console.log("inject token");
								config.headers['x-access-token'] = new_token;
								return config;
							}
						}
						xhttp.open("POST", apiVer+"auth/refresh", false);
						xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
						xhttp.send(data);
					};
					return config;
				}
			}else{
					config.headers['x-access-token'] = "";
					return config;
			}
            
        }
    };
    return sessionInjector;
}]);
app.config(['$httpProvider', function($httpProvider) {  
    $httpProvider.interceptors.push('sessionInjector');
}]);





app.controller('DomusGuardCtrl', ['$log', '$rootScope', '$cookies', function($log, $rootScope, $cookies) {
		$log.info("DomusGuard Ctrl");
		
		if($cookies.get('refresh_token')){
			$rootScope.isLoggedIn = true;
		}else{
			$rootScope.isLoggedIn = false;
		}
		
}]);







/********************
*
*  Main Header Controll
*
**********************/
app.controller('MenuHeaderCtrl', ['$log' ,'$scope', '$rootScope', '$location',  '$cookies', 'HeaderService','LoginService', function($log, $scope, $rootScope, $location, $cookies, HeaderService, LoginService) {
		
		
		userInfoQuery = HeaderService.query(0).$promise;
		
		userInfoQuery.then(function(response) {
			if (response.result) {
						$scope.userName = response.result.name;
						$scope.location = response.result.location;
			}
		}, function(reason) {
			  console.log('Failed MenuHeaderCtrl: ' + reason);
		});
		
		$scope.logout = function () {
			$log.info("Logout");
			
			logoutPost = LoginService.logout().$promise;
			
			logoutPost.then(function(response) {
				console.log(response);
				if (response.status == 200) {
					$log.info("delete cookies");
					$cookies.remove('token');
					$cookies.remove('token_expire_at');
					$cookies.remove('refresh_token');
					$rootScope.isLoggedIn = false;
					$location.url('/');
				}
			}, function(reason) {
				  console.log('Failed MenuHeaderCtrl: ' + reason);
			});
						
		};
		
		$scope.configuration = function () {
			$log.info("System Config");
			$location.url('/configuration');
		};
		

}]);



/***************************************************
*
* 		Service
*
****************************************************/

 app.factory('HeaderService', ['$resource',
  function($resource){
	var response = $resource(apiVer+'main/userInfo/:entryId', {}, {
			query: { method: 'GET', params: {entryId: '@entryId'}, isArray : false }
    });
    return response;

  }]);
  







