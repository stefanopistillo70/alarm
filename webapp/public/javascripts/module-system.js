var dgModuleSystem = angular.module('dgModuleSystem', ['ngResource','ui.bootstrap','ui.grid','ui.grid.selection']);

dgModuleSystem.controller('SystemCtrl', ['$scope', '$uibModal', 'SystemService', function($scope, $uibModal, SystemService) {
			$scope.enableEmailApi = false;
			$scope.enableGoogleEmailApi = false;
		
}]);





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
  







