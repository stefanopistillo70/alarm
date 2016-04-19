
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

		$scope.$on('event:google-plus-signin-failure', function (event,authResult) {
		// Auth failure or signout detected
			console.log("Event failure");
		});
		
		$scope.login = function() {
			console.log("Login");
			
			loginQuery = LoginService.query().$promise;
		
			loginQuery.then(function(response) {
				if (response.result) {
					$scope.$parent.$close('login');
				}
			}, function(reason) {
				  console.log('Failed LoginCtrl: ' + reason);
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
			update: {method:'POST', params: {entryId: '@entryId'}},
    });
    return response;

}]);
  







