var dgModuleLocation = angular.module('dgModuleLocation', []);



/***************************************************
*
* 		Service
*
****************************************************/

dgModuleLocation.factory('LocationService', ['$resource',
  function($resource){
	var response = $resource(apiVer+'location/:entryId', {}, {
			query: { method: 'GET', params: {} },
			update: {method:'PUT', params: {entryId: '@entryId'}},
    });
    return response;

}]);
  







