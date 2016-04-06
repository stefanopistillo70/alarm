
var dgModuleConfig = angular.module('dgModuleConfig', ['ngResource']);

 

/**************************************

Services

**************************************/
 
dgModuleConfig.factory('ConfigService', ['$resource',
function($resource){
var response = $resource('config/:entryId', {entryId: '@entryId'}, {
		query: { method: 'GET', params: {}, isArray: true },
		post: {method:'POST'},
		update: {method:'PUT', params: {entryId: '@entryId'}},
		remove: {method:'DELETE'}
});
return response;

}]);