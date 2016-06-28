
var dgModuleLogin = angular.module('dgModuleLogin', ['ngResource','ui.bootstrap']);


dgModuleLogin.controller('LoginCtrl', ['$log', '$scope', '$rootScope', '$cookies', '$location', '$uibModal', 'GoogleLoginService', 'LocalLoginService', function($log, $scope, $rootScope, $cookies, $location, $uibModal, GoogleLoginService, LocalLoginService) {
		
		$scope.local = false;
		$scope.signup = false;
		
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
		
		$scope.loginGoogle = function() {
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
								console.log(response.result.access_token);
								console.log(response.result.refresh_token);
								console.log(response.result.expire_at);
								$cookies.put('token', response.result.access_token);
								$cookies.put('refresh_token',response.result.refresh_token);
								$cookies.put('token_expire_at',response.result.expire_at);

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
		
		
		$scope.checkEmail = function() {
			
			if($scope.user && $scope.user.email){
				$log.info("checkEmail " + $scope.user.email);
				var getUser = LocalLoginService.get({ entryId: $scope.user.email}).$promise;
			
				getUser.then(function(response) {
						$log.info(response.result);
						if(response.result != "local"){
							console.log('email already registered on google');
						}else{
							console.log('email already registered on local');
						}
					}, function(reason) {
						if(reason.status == 404){
							console.log('email not exists');
							$scope.signup = true;
						}
				});
			}
		}

		
		
		
		$scope.loginLocal = function() {
			$log.info("Form error : "+$scope.userForm.$invalid);
			
			if($scope.signup) {
				$log.info("register");
				console.log($scope);
				if (!$scope.user.pwd){
					$scope.userForm.pwd.$error = { msg : "no password"};
				}else $scope.userForm.pwd.$error = {};
				
				if ($scope.user.pwd != $scope.user.pwd2){
					$scope.userForm.pwd2.$error = { msg : "passwords are different"};
				}else $scope.userForm.pwd2.$error = {};				
			}else{
				$log.info("login local");				
			};
			
			if(!$scope.userForm.$invalid){
				$log.info("Form is valid");	
				register = LocalLoginService.save($scope.user).$promise;

				register.then(function(response) {
					console.log(response);
					if (response.result) {
						console.log(response.result.access_token);
						console.log(response.result.refresh_token);
						console.log(response.result.expire_at);
						$cookies.put('token', response.result.access_token);
						$cookies.put('refresh_token',response.result.refresh_token);
						$cookies.put('token_expire_at',response.result.expire_at);
						$rootScope.isLoggedIn = true;
					}
					$location.url('/');											
				}, function(reason) {
					  console.log('Failed Login');
					  $scope.error = true;
				});
			};
		}
		
		
		
		$scope.checkForError = function(field, checkPristine){
			var hasError = false;
			if(checkPristine) hasError =  ((((field.$error != undefined) && (Object.keys(field.$error).length != 0) ) || field.$invalid )&& !field.$pristine);
				else hasError =  (((field.$error != undefined) && (Object.keys(field.$error).length != 0) ) || field.$invalid );
			//console.log("Has error -> "+hasError);
			//console.log("1 -> "+(field.$error != undefined));
			//console.log("2 -> "+(Object.keys(field.$error).length != 0));
			//console.log("3 -> "+field.$invalid);
			//console.log("4 -> "+!field.$pristine);
			return hasError;
		}
		
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


dgModuleLogin.factory('GoogleService', ['$resource',
  function($resource){
	var response = $resource(apiVer+'auth/google/updateConsensus', {}, {
			saveEmailConsensus: {method:'POST', params: {}}
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


dgModuleLogin.factory('LocalLoginService', ['$resource',
  function($resource){
	var response = $resource(apiVer+'auth/token/:entryId', {entryId: '@entryId'}, {
    });
    return response;
}]);














