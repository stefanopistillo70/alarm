var dgModuleDevice = angular.module('dgModuleDevice', ['ngResource','ui.bootstrap','ui.grid','ui.grid.selection','dgModuleLocation']);

dgModuleDevice.controller('DeviceCtrl', ['$scope', '$uibModal', 'DeviceService', function($scope, $uibModal, DeviceService) {
		
		$scope.gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false };
		 
		$scope.gridOptions.columnDefs = [
				{ name: 'id' },
				{ name: 'name'},
				{ name: 'deviceType', displayName: 'Device Type', allowCellFocus : false },
				{ name: 'technology', displayName: 'Tecnology',  allowCellFocus : false},
				{ name: 'sensors', displayName: 'Sensors' }
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
			console.log(selected);
			console.log("DELETE device");
			if(selected && selected.length > 0){
				var device = selected[0];
				console.log(device.id);
				
				var deviceCancel = DeviceService.remove({entryId:device._id}).$promise;
		
				deviceCancel.then(function(response) {
					if (response.result) {
						console.log('device cancelled');
						angular.forEach(selected, function (data, index) {
							$scope.gridOptions.data.splice($scope.gridOptions.data.lastIndexOf(data), 1);
						});
					}
				}, function(reason) {
					  console.log('Failed remove: ');
					  console.log(reason);
				});
				
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
		
		deviceQuery = DeviceService.query().$promise;
		
		deviceQuery.then(function(response) {
			if (response.result) {
				console.log("DATA");
				console.log(response.result);
				$scope.gridOptions.data = response.result;
			}
		}, function(reason) {
			  console.log('Failed DeviceCtrl: ' + reason);
		});
		
}]);





/***************************************************

Modal new Device

****************************************************/

dgModuleDevice.controller('ModalNewDeviceCtrl', function ($scope, $uibModal, LocationService) {

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
		  console.log('Config -> enableNewDevice=false');
		  LocationService.update({entryId:0}, {enableNewDevice : false});
		});
	};

});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

dgModuleDevice.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, DeviceService, LocationService) {

	$scope.showProgress = true;
	
	var updateConfigTrue = LocationService.update({entryId:0}, {enableNewDevice : true}).$promise;
	
	updateConfigTrue.then(function(result) {
		  
		var checkForDB = { value : true}

		$scope.cancelNewDevModal = function () {
			console.log("CANCELL - ModalInstanceCtrl");
			$uibModalInstance.dismiss('cancel');
			LocationService.update({entryId:0}, {enableNewDevice : false});
			checkForDB.value = false;
		};
		
		$scope.newDevFound = function(device){
			console.log("new device found");
			console.log(device);
			$scope.device = device;
			$scope.showProgress = false;
			$scope.title = "New Device Found";
			LocationService.update({entryId:id}, {enableNewDevice : false});
			checkForDB.value = false;
		}
		  
		checkDb(checkForDB, DeviceService, -1, Date.now(), $scope);
	  
	}, 
	function(reason) {
		  console.log('Failed: ' + reason);
	});
		
  
});


var checkDb = function(checkForDB, DeviceService, initialValue, initialDate, $scope){
	
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
					if(devices.length > initialValue) {
						
						devices = devices.sort(function(d1, d2){
							var date1 = Date.parse(d1.insertDate);
							var date2 = Date.parse(d2.insertDate);
							return date2 - date1;
						});
						
						device = devices[0];
						$scope.newDevFound(device);
						return;
					} 
				}
				setTimeout(checkDb.bind(null, checkForDB, DeviceService, initialValue, initialDate, $scope),3000);
			  
			}, function(reason) {
			  console.log('Failed: ' + reason);
			});
		}else{
			$scope.cancelNewDevModal();
		}
	};
};




/***************************************************
*
* 		Update Device
*
****************************************************/


dgModuleDevice.controller('DeviceUpdateCtrl', ['$scope', 'DeviceService', function($scope, DeviceService) {
		
		$scope.updateDU = function(device) {
			console.log("UPDATE DEVICE");
			console.log(device);
			
			deviceUpdate = DeviceService.update({entryId:device._id},device).$promise;
		
			deviceUpdate.then(function(response) {
				if (response.result) {
					$scope.$parent.$close('update device');
				}
			}, function(reason) {
				  console.log('Failed DeviceUpdateCtrl: ' + reason);
			});
			
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

 dgModuleDevice.factory('DeviceService', ['$resource',
  function($resource){
	var response = $resource(apiVer+'device/:entryId', {entryId: '@entryId'}, {
			query: { method: 'GET', params: {} },
			post: {method:'POST'},
			update: {method:'PUT', params: {entryId: '@entryId'}},
			remove: {method:'DELETE', params: {entryId: '@entryId'}}
    });
    return response;

  }]);
  







