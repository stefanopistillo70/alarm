var dgModuleDevice = angular.module('dgModuleDevice', ['ngResource','ui.bootstrap','ui.grid','dgModuleConfig']);

dgModuleDevice.controller('DeviceCtrl', ['$scope', 'DeviceService', function($scope, DeviceService) {
		
		$scope.gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false };
		 
		$scope.gridOptions.columnDefs = [
				{ name: 'id' },
				{ name: 'name'},
				{ name: 'deviceType', displayName: 'Device Type', allowCellFocus : false },
				{ name: 'technology', displayName: 'tecnology',  allowCellFocus : false},
				{ name: 'address.city' }
			  ];
 
		//$scope.gridOptions.multiSelect = false;
		$scope.gridOptions.modifierKeysToMultiSelect = false;
		//$scope.gridOptions.noUnselect = true;
		$scope.gridOptions.onRegisterApi = function( gridApi ) {
		$scope.gridApi = gridApi;
		};
		
		$scope.gridOptions.isRowSelectable = function(row){ return true;};
		
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

	$scope.animationsEnabled = true;

	$scope.open = function (size) {

		var modalInstance = $uibModal.open({
		  animation: $scope.animationsEnabled,
		  templateUrl: 'loadingModalContent.html',
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

	$scope.toggleAnimation = function () {
		$scope.animationsEnabled = !$scope.animationsEnabled;
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
		  
		  
		$scope.update = function(user) {
			console.log("UPDATE USER");
			console.log(user);
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
			
			deviceQuery.then(function(result) {
			  
				if(result) console.log('Initial ->'+initialValue+'   n rec ->'+result.length);
				
				if(initialValue === -1) initialValue = result.length;
				else{
					if(result.length > result.length){
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

//********************* Services *************************



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
  







