var dgModuleZone = angular.module('dgModuleZone', ['ngResource','ui.bootstrap','ui.grid','ui.grid.selection']);

dgModuleZone.controller('ZoneCtrl', ['$scope', '$uibModal', 'ZoneService', function($scope, $uibModal, ZoneService) {
		
		
		$scope.gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false };
		 
		$scope.gridOptions.columnDefs = [
				{ name: 'name'},
				{ name: 'armed'}
			  ];
 
		$scope.gridOptions.multiSelect = false;
		$scope.gridOptions.modifierKeysToMultiSelect = false;
		$scope.gridOptions.noUnselect = true;
		$scope.gridOptions.onRegisterApi = function( gridApi ) {
			$scope.gridApi = gridApi;
		}; 
		
		$scope.gridOptions.enableRowSelection = true;
		
		$scope.deleteRow = function () {
			var selected = $scope.gridApi.selection.getSelectedRows();
			console.log("DELETE");
			if(selected && selected.length > 0){
				var zone = selected[0];
				console.log(zone.id);
			}
		};
				
		$scope.modifyRow = function (size) {
			var selected = $scope.gridApi.selection.getSelectedRows();
			console.log("Modify");
			if(selected && selected.length > 0){
				var zone = selected[0];
				console.log(zone.id);
				
				$scope.zone = zone;
				$scope.title = "Modify Device";
				var modifyModalInstance = $uibModal.open({
					  animation: true,
					  templateUrl: 'partials/zoneForm.html',
					  size: size,
					  scope: $scope,
					  resolve: {}
					});

				modifyModalInstance.result.then(function (result) {
						console.log('result ');
						console.log(result);
					}, function () {
					  console.log('Modal dismissed at: ' + new Date());
				});
								
			}
		};
		
		zoneQuery = ZoneService.query().$promise;
		
		zoneQuery.then(function(response) {
			if (response.result) {
				$scope.gridOptions.data = response.result;
			}
		}, function(reason) {
			  console.log('Failed ZoneCtrl: ' + reason);
		});
		
}]);






/***************************************************
*
* 		Update Zone
*
****************************************************/


dgModuleZone.controller('ZoneUpdateCtrl', ['$scope', 'ZoneService', function($scope, ZoneService) {
		
		$scope.updateDU = function(zone) {
			console.log("UPDATE ZONE");
			console.log(zone);
			$scope.$parent.$close('update zone');
		};
		
		$scope.cancelDU = function () {
			console.log("CANCELL - ZoneUpdateCtrl");
			$scope.$parent.$dismiss('cancel');
		};
		
}]);






/***************************************************
*
* 		Service
*
****************************************************/

 dgModuleZone.factory('ZoneService', ['$resource',
  function($resource){
	var response = $resource('zone:entryId', {}, {
			query: { method: 'GET', params: {} },
			post: {method:'POST'},
			update: {method:'PUT', params: {entryId: '@entryId'}},
			remove: {method:'DELETE'}
    });
    return response;

  }]);
  







