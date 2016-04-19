
var dgModuleLogin = angular.module('dgModuleLogin', ['ngResource','ui.bootstrap']);

dgModuleLogin.controller('LoginCtrl', ['$scope', '$rootScope', '$uibModal', 'LoginService', function($scope, $rootScope, $uibModal, LoginService) {
		
		
		$scope.$on('event:google-plus-signin-success', function (event,authResult) {
		// Send login to server or save into cookie
			console.log("Event succes");
			console.log(event);
			console.log(authResult);
			
			
			
			loginUpdate = LoginService.update({entryId:0},authResult.hg).$promise;
		
			loginUpdate.then(function(response) {
				if (response.result) {
					console.log(response.result);
				}
				
				console.log("Save token in rootScope");
				if(!$rootScope.auth) $rootScope.auth = {};
				$rootScope.auth.google = authResult.hg;
				
			}, function(reason) {
				  console.log('Failed DeviceUpdateCtrl: ' + reason);
			});
				
		});

		
		$scope.login = function() {
			console.log("Login");
			
			console.log("**************** gapi.auth2.init");
				gapi.load('auth2', function() {
					auth2 = gapi.auth2.init({
					  client_id: '347967676922-9lsavri7424fsn1bmjcoepm3tme8bbfd.apps.googleusercontent.com',
					  // Scopes to request in addition to 'profile' and 'email'
					  scope:'https://www.googleapis.com/auth/gmail.send https://www.googleapis.com/auth/userinfo.email',
					  access_type: "offline"
					});
					
					console.log("SIGNED ->"+auth2.isSignedIn);
					
					var googleUser = auth2.currentUser.get();
					
					console.log(googleUser);
					
					// Listen for sign-in state changes.
					/*  auth2.isSignedIn.listen(signinChanged);

					  // Listen for changes to current user.
					  auth2.currentUser.listen(userChanged);

					  // Sign in the user if they are currently signed in.
					  if (auth2.isSignedIn.get() == true) {
						auth2.signIn();
					  }

					  // Start with the current live values.
					  if (auth2){
						console.log('Refreshing values...');
						googleUser = auth2.currentUser.get();
					  }
					*/
					
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
								
								console.log("Save token in rootScope");
								if(!$rootScope.auth) $rootScope.auth = {};
								$rootScope.auth.google = response.result;
								
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

dgModuleLogin.factory('LoginService', ['$resource',
  function($resource){
	var response = $resource('/auth/google', {}, {
			query: { method: 'GET', params: {} },
			getToken: {method:'POST', params: {}},
    });
    return response;

}]);
  







