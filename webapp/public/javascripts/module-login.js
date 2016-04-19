
var dgModuleLogin = angular.module('dgModuleLogin', ['ngResource','ui.bootstrap']);

dgModuleLogin.controller('LoginCtrl', ['$scope', '$uibModal', 'LoginService', function($scope, $uibModal, LoginService) {
		
		
		$scope.$on('event:google-plus-signin-success', function (event,authResult) {
		// Send login to server or save into cookie
			console.log("Event succes");
			console.log(event);
			console.log(authResult);
			
			var id_token = authResult.hg.id_token
			var xhr = new XMLHttpRequest();
			xhr.open('POST', 'http://127.0.0.1/auth/google');
			xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
			xhr.onload = function() {
			  console.log('Signed in as: ' + xhr.responseText);
			  
			  $rootScope.auth.google = authResult.hg;
			  
			};
			xhr.send('idtoken=' + id_token);
			
			
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
  







