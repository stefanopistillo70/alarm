var dgModuleDevice = angular.module('dgModuleDevice', ['ngResource','ui.bootstrap','ui.grid','ui.grid.selection','dgModuleConfig']);

dgModuleDevice.controller('DeviceCtrl', ['$scope', '$uibModal', 'DeviceService', function($scope, $uibModal, DeviceService) {
		
		
		$scope.gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false };
		 
		$scope.gridOptions.columnDefs = [
				{ name: 'id' },
				{ name: 'name'},
				{ name: 'deviceType', displayName: 'Device Type', allowCellFocus : false },
				{ name: 'technology', displayName: 'tecnology',  allowCellFocus : false},
				{ name: 'address.city' }
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
				
				
				var modalInstance = $uibModal.open({
					  animation: true,
					  templateUrl: 'partials/deviceForm.html',
					  size: size,
					  resolve: {}
					});

					modalInstance.result.then(function (result) {
						console.log('result ');
						console.log(result);
					}, function () {
					  $log.info('Modal dismissed at: ' + new Date());
				});
				
			}
		};
		
		deviceQuery = DeviceService.query().$promise;
		
		deviceQuery.then(function(response) {
			if (response.result) {
				$scope.gridOptions.data = response.result;
			}
		}, function(reason) {
			  console.log('Failed DeviceCtrl: ' + reason);
		});
		
}]);





/***************************************************

Modal new Device

****************************************************/

dgModuleDevice.controller('ModalNewDeviceCtrl', function ($scope, $uibModal, $log) {

	$scope.open = function (size) {

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
		  $log.info('Modal dismissed at: ' + new Date());
		});
	};

});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

dgModuleDevice.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, DeviceService, ConfigService) {

	var queryConfig = ConfigService.query().$promise;
	
	queryConfig.then(function(result) {
		
			var id = result[0]._id;
			
			console.log(id);
			
			var updateConfigTrue = ConfigService.update({entryId:id}, {enableNewDevice : true}).$promise;
			
			updateConfigTrue.then(function(result) {
		  
			$scope.progress = true;
			$scope.formUpdateDevice  = true;

			var checkForDB = { value : true}

			$scope.cancel = function () {
				$uibModalInstance.dismiss('cancel');
				ConfigService.update({entryId:id}, {enableNewDevice : false});
				checkForDB.value = false;
			};
			  
			checkDb(checkForDB, DeviceService, -1, Date.now(), $uibModalInstance, ConfigService);
		  
		}, 
		function(reason) {
			  console.log('Failed: ' + reason);
		});
		
	}, 
	function(reason) {
		  console.log('Failed: ' + reason);
	});
  
});


var checkDb = function(checkForDB, DeviceService, initialValue, initialDate, $uibModalInstance, ConfigService){
	
	if(checkForDB.value){
		
		var now = Date.now();
		if((Date.now() - initialDate) < 10000){
			console.log('check db');
			var deviceQuery = DeviceService.query().$promise;
			
			deviceQuery.then(function(response) {
			  
				var devices = response.result;
				if(devices) console.log('Initial ->'+initialValue+'   n rec ->'+devices.length);
				
				if(initialValue === -1) initialValue = devices.length;
				else if(devices){
					if(devices.length > initialValue){
						$uibModalInstance.close('found new device');
						ConfigService.update({entryId:0}, {enableNewDevice : false});
						return;
					} 
				}
				setTimeout(checkDb.bind(null, checkForDB, DeviceService, initialValue, initialDate, $uibModalInstance, ConfigService),3000);
			  
			}, function(reason) {
			  console.log('Failed: ' + reason);
			});
		}else{
			console.log('check DB timeout');
			$uibModalInstance.dismiss('timeout');
			ConfigService.update({entryId:0}, {enableNewDevice : false});
			return;
		}
		
	};
};




/***************************************************
*
* 		Update Device
*
****************************************************/


dgModuleDevice.controller('DeviceUpdateCtrl', ['$scope', 'DeviceService', function($scope, DeviceService) {
		
		$scope.update = function(device) {
			console.log("UPDATE DEVICE");
			console.log(device);
		};
		
		$scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
		};
		
}]);






/***************************************************
*
* 		Service
*
****************************************************/

 dgModuleDevice.factory('DeviceService', ['$resource',
  function($resource){
	var response = $resource('device:entryId', {}, {
			query: { method: 'GET', params: {} },
			post: {method:'POST'},
			update: {method:'PUT', params: {entryId: '@entryId'}},
			remove: {method:'DELETE'}
    });
    return response;

  }]);
  






