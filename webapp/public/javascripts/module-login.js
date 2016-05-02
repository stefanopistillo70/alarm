
var dgModuleLogin = angular.module('dgModuleLogin', ['ngResource','ui.bootstrap']);




dgModuleLogin.controller('LoginCtrl', ['$scope', '$rootScope', '$location', '$uibModal', 'GoogleLoginService', function($scope, $rootScope, $location, $uibModal, GoogleLoginService) {
		
		var getGoogleAccoutClientId = GoogleLoginService.getGoogleAccoutClientId().$promise;

		var googleClientID = "";
		
		getGoogleAccoutClientId.then(function(response) {
				if (response.result) {
					googleClientID = response.result;
				}
			}, function(reason) {
				console.log('Failed get google Client ID: ' + reason);
		});

		
/*		if (!$rootScope.auth) $rootScope.auth = {};
		if (!$rootScope.auth.google) $rootScope.auth.google = {} 
		if (!$rootScope.auth.google.gapi){
			$rootScope.auth.google.gapi = {};
			console.log("**************** gapi.auth2.init");
			gapi.load('auth2', function() {
					$rootScope.auth.google.gapi.auth2 = gapi.auth2.init({
					  client_id: googleClientID,
					  // Scopes to request in addition to 'profile' and 'email'
					  scope:'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email',
					  access_type: "offline"
					});
			});
		} 
*/
		
		$scope.login = function() {
			console.log("Login");
			
			
			gapi.load('auth2', function() {
					var auth2 = gapi.auth2.init({
					  client_id: googleClientID,
					  // Scopes to request in addition to 'profile' and 'email'
					  scope:'openid profile email',
					  //access_type: "offline"
					});
			
			
			//var auth2 = $rootScope.auth.google.gapi.auth2;
			
			console.log("SIGNED ->"+auth2.isSignedIn.get());
			
			var googleUser = auth2.currentUser.get();
			
			console.log(googleUser);
								
			auth2.grantOfflineAccess({'redirect_uri': 'postmessage'}).then(
				function(authResult) {
													
				  if (authResult['code']) {
					console.log("CODE ->"+authResult['code']);
					
					var data = {};
					data.code = authResult['code'];
					loginGetToken = GoogleLoginService.getToken(data).$promise;

					loginGetToken.then(function(response) {
						if (response.result) {
							console.log(response.result);
							$rootScope.isLoggedIn = true;
						}
						$location.url('/');
						//window.location = "http://localhost:3000/#/";
												
					}, function(reason) {
						  console.log('Failed Login insert Code: ' + reason);
					});
					
					
				  } else {
					console.log("ERROR");
				  }
				  
			});
			
			});
		};
}]);




/***************************************************
*
* 		Service
*
****************************************************/

dgModuleLogin.factory('GoogleLoginService', ['$resource',
  function($resource){
	var response = $resource(apiVer+'auth/google', {}, {
			getToken: {method:'POST', params: {}},
			getGoogleAccoutClientId: {method:'GET', params: {}}
    });
    return response;

}]);


dgModuleLogin.factory('LoginService', ['$resource',
  function($resource){
	var response = $resource(apiVer+'main/logout', {}, {
			logout: {method:'POST', params: {}},
    });
    return response;

}]);












