var dgModuleMessage = angular.module('dgModuleMessage', ['ngResource','ui.bootstrap','ui.grid','ui.grid.selection']);

dgModuleMessage.controller('MessageCtrl', ['$scope', '$uibModal', 'MessageService', function($scope, $uibModal, MessageService) {
		
		$scope.gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false };
				 
		$scope.gridOptions.columnDefs = [
				{ name: 'insertDate' },
				{ name: 'message'},
				{ name: 'level' }
			  ];
 
		$scope.gridOptions.multiSelect = false;
		$scope.gridOptions.modifierKeysToMultiSelect = false;
		$scope.gridOptions.noUnselect = true;
		
		$scope.gridOptions.enableRowSelection = true;
						
		modifyQuery = MessageService.query().$promise;
		
		modifyQuery.then(function(response) {
			if (response.result) {
				console.log("DATA");
				console.log(response.result);
				$scope.gridOptions.data = response.result;
				//$scope.gridOptions.data = { insertDate: '', message : "ciao", level : 'level'};
			}
		}, function(reason) {
			  console.log('Failed ModifyCtrl: ' + reason);
		});
		
}]);









/***************************************************
*
* 		Service
*
****************************************************/

 dgModuleMessage.factory('MessageService', ['$resource',
  function($resource){
	var response = $resource(apiVer+'message/:entryId', {entryId: '@entryId'}, {
			query: { method: 'GET', params: {} },
    });
    return response;

  }]);
  







