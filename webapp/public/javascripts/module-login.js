
var dgModuleLogin = angular.module('dgModuleLogin', ['ngResource','ui.bootstrap']);

dgModuleLogin.controller('LoginCtrl', ['$scope', '$uibModal', 'LoginService', function($scope, $uibModal, LoginService) {
		
		
		$scope.$on('event:google-plus-signin-success', function (event,authResult) {
		// Send login to server or save into cookie
			console.log("Event succes");
			console.log(event);
			console.log(authResult);
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
    });
    return response;

}]);
  







