var dgModuleSystem = angular.module('dgModuleSystem', ['ngResource','ui.bootstrap','ui.grid','ui.grid.selection']);

dgModuleSystem.controller('SystemCtrl', ['$log', '$scope', '$uibModal', 'SystemService', 'GoogleLoginService', function($log, $scope, $uibModal, SystemService, GoogleLoginService) {
			$scope.enableEmailApi = false;
			$scope.enableGoogleEmailApi = false;
			
			$scope.saveNotification = function () {
				$log.info("Save Notification");
				
				
				var getGoogleAccoutClientId = GoogleLoginService.getGoogleAccoutClientId().$promise;
				var googleClientID = "";
				getGoogleAccoutClientId.then(function(response) {
						if (response.result) {
							googleClientID = response.result;
							
							getGoogleEmailConsensum(googleClientID);
						}
					}, function(reason) {
						console.log('Failed get google Client ID: ' + reason);
				});
								
				
			}
		
}]);






var getGoogleEmailConsensum = function(googleClientID){
	
			gapi.load('auth2', function() {
				var auth2 = gapi.auth2.init({
				  client_id: googleClientID,
				  // Scopes to request in addition to 'profile' and 'email'
				  scope:'https://www.googleapis.com/auth/gmail.send',
				  access_type: "offline"
				});
						
				console.log("SIGNED ->"+auth2.isSignedIn.get());
				
				var googleUser = auth2.currentUser.get();
				
				console.log(googleUser);
									
				auth2.grantOfflineAccess({'redirect_uri': 'postmessage'}).then(
					function(authResult) {
														
					  if (authResult['code']) {
						console.log("CODE ->"+authResult['code']);
						
						/*var data = {};
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
						*/
						
					  } else {
						console.log("ERROR");
					  }
					  
				});
			});
	
}





/***************************************************
*
* 		Service
*
****************************************************/

dgModuleSystem.factory('SystemService', ['$resource',
  function($resource){
	var response = $resource(apiVer+'zone/:entryId', {}, {
			query: { method: 'GET', params: {} },
			post: {method:'POST'},
			update: {method:'PUT', params: {entryId: '@entryId'}},
			remove: {method:'DELETE'}
    });
    return response;

}]);
  







