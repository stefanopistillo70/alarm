var dgModuleSystem = angular.module('dgModuleSystem', ['ngResource','ui.bootstrap']);

dgModuleSystem.controller('SystemCtrl', ['$log', '$scope', 'SystemService', 'GoogleLoginService', 'GoogleService', function($log, $scope, SystemService, GoogleLoginService, GoogleService) {
			
			$log.info("Init Controller");
			
			$scope.saveNotification = function () {
				
				var $accordionNotificationScope = $scope.accordion.groups[1].$$childHead;

				$log.info("Save Notification "+$accordionNotificationScope.enableEmailApi+"   "+$accordionNotificationScope.enableGoogleEmailApi);
				
				if( $accordionNotificationScope.enableEmailApi && $accordionNotificationScope.enableGoogleEmailApi ){
					var getGoogleAccoutClientId = GoogleLoginService.getGoogleAccoutClientId().$promise;
					var googleClientID = "";
					getGoogleAccoutClientId.then(function(response) {
							if (response.result) {
								googleClientID = response.result;
								getGoogleEmailConsensus(googleClientID, GoogleService);
							}
						}, function(reason) {
							console.log('Failed get google Client ID: ' + reason);
					});
				}
								
			}
}]);


var getGoogleEmailConsensus = function(googleClientID, GoogleService){
	
			gapi.load('auth2', function() {
				var auth2 = gapi.auth2.init({
				  client_id: googleClientID,
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
						
						var data = {};
						data.code = authResult['code'];
						saveEmailConsensus = GoogleService.saveEmailConsensus(data).$promise;

						saveEmailConsensus.then(function(response) {
							if (response.result) {
								console.log(response.result);
							}
													
						}, function(reason) {
							  console.log('Failed Login insert Code: ' + reason);
						});
						
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
  







