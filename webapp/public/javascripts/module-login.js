
var dgModuleLogin = angular.module('dgModuleLogin', ['ngResource','ui.bootstrap']);




dgModuleLogin.controller('LoginCtrl', ['$scope', '$rootScope', '$uibModal', 'LoginService', function($scope, $rootScope, $uibModal, LoginService) {
		
		
		if (!$rootScope.auth) $rootScope.auth = {};
		if (!$rootScope.auth.google) $rootScope.auth.google = {} 
		if (!$rootScope.auth.google.gapi){
			$rootScope.auth.google.gapi = {};
			console.log("**************** gapi.auth2.init");
			gapi.load('auth2', function() {
					$rootScope.auth.google.gapi.auth2 = gapi.auth2.init({
					  client_id: '347967676922-9lsavri7424fsn1bmjcoepm3tme8bbfd.apps.googleusercontent.com',
					  // Scopes to request in addition to 'profile' and 'email'
					  scope:'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email',
					  access_type: "offline"
					});
			});
		} 
		
		$scope.login = function() {
			console.log("Login");
			
			var auth2 = $rootScope.auth.google.gapi.auth2;
			
			console.log("SIGNED ->"+auth2.isSignedIn.get());
			
			var googleUser = auth2.currentUser.get();
			
			console.log(googleUser);
								
			auth2.grantOfflineAccess({'redirect_uri': 'postmessage'}).then(
				function(authResult) {
													
				  if (authResult['code']) {
					console.log("CODE ->"+authResult['code']);
					
					var data = {};
					data.code = authResult['code'];
					loginGetToken = LoginService.getToken(data).$promise;

					loginGetToken.then(function(response) {
						if (response.result) {
							console.log(response.result);
						}
						window.location = "http://localhost:3000/#/";
												
					}, function(reason) {
						  console.log('Failed Login insert Code: ' + reason);
					});
					
					
				  } else {
					console.log("ERROR");
				  }
				  
				});
		};
}]);




/***************************************************
*
* 		Service
*
****************************************************/

dgModuleLogin.factory('LoginService', ['$resource',
  function($resource){
	var response = $resource(apiVer+'auth/google', {}, {
			query: { method: 'GET', params: {} },
			getToken: {method:'POST', params: {}},
    });
    return response;

}]);








