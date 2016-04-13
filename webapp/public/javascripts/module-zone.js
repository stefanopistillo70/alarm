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
				var device = selected[0];
				console.log(device.id);
			}
		};
				
		$scope.modifyRow = function (size) {
			var selected = $scope.gridApi.selection.getSelectedRows();
			console.log("Modify");
			if(selected && selected.length > 0){
				var device = selected[0];
				console.log(device.id);
				
				$scope.device = device;
				$scope.title = "Modify Device";
				var modifyModalInstance = $uibModal.open({
					  animation: true,
					  templateUrl: 'partials/deviceForm.html',
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

Modal new Zone

****************************************************/
/*
dgModuleZone.controller('ModalNewZoneCtrl', function ($scope, $uibModal) {

	$scope.openNewDevModal = function (size) {

		var modalInstance = $uibModal.open({
		  animation: true,
		  templateUrl: 'partials/loadingModalContent.html',
		  controller: 'ModalInstanceCtrl',
		  size: size,
		  resolve: {}
		});

		modalInstance.result.then(function (result) {
			console.log('result ');
			console.log(result);
			
		}, function () {
		  console.log('Modal dismissed at: ' + new Date());
		});
	};

});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

dgModuleZone.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, ZoneService) {
	
	var queryConfig = ConfigService.query().$promise;
	
	queryConfig.then(function(result) {
		
			var id = result[0]._id;
			
			console.log(id);
			
			var updateConfigTrue = ConfigService.update({entryId:id}, {enableNewDevice : true}).$promise;
			
			updateConfigTrue.then(function(result) {
		  
			var checkForDB = { value : true}

			$scope.cancelNewDevModal = function () {
				console.log("CANCELL - ModalInstanceCtrl");
				$uibModalInstance.dismiss('cancel');
				ConfigService.update({entryId:id}, {enableNewDevice : false});
				checkForDB.value = false;
			};
			
			$scope.newDevFound = function(device){
				console.log("new device found");
				console.log(device);
				$scope.device = device;
				$scope.showProgress = false;
				$scope.title = "New Device Found";
				ConfigService.update({entryId:id}, {enableNewDevice : false});
				checkForDB.value = false;
			}
			  
			checkDb(checkForDB, DeviceService, -1, Date.now(), $scope, ConfigService);
		  
		}, 
		function(reason) {
			  console.log('Failed: ' + reason);
		});
		
	}, 
	function(reason) {
		  console.log('Failed: ' + reason);
	});
  
});

*/

/***************************************************
*
* 		Update Zone
*
****************************************************/


dgModuleZone.controller('ZoneUpdateCtrl', ['$scope', 'ZoneService', function($scope, ZoneService) {
		
		$scope.updateDU = function(device) {
			console.log("UPDATE DEVICE");
			console.log(device);
			$scope.$parent.$close('update device');
		};
		
		$scope.cancelDU = function () {
			console.log("CANCELL - DeviceUpdateCtrl");
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
  







