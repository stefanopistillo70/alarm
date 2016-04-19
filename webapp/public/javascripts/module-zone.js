var dgModuleZone = angular.module('dgModuleZone', ['ngResource','ui.bootstrap','ui.grid','ui.grid.selection']);

dgModuleZone.controller('ZoneCtrl', ['$scope', '$uibModal', 'ZoneService', function($scope, $uibModal, ZoneService) {
		
		
		$scope.gridOptions = { enableRowSelection: true, enableRowHeaderSelection: false };
		 
		$scope.gridOptions.columnDefs = [
				{ name: 'name'},
				{ name: 'armed'},
				{ name: 'devices'}
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
				
				var zoneCancel = ZoneService.remove({entryId:zone._id}).$promise;
		
				zoneCancel.then(function(response) {
					if (response.result) {
						console.log('zone cancelled');
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
				var zone = selected[0];
				console.log(zone.id);
				
				$scope.zone = zone;
				$scope.title = "Modify Zone";
				$scope.newZone = false;
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
		
		
		$scope.newRow = function (size) {
			console.log("New");
			
			$scope.zone = { name : "", armed : false, devices : []};
			$scope.title = "New Zone";
			$scope.newZone = true;
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


dgModuleZone.controller('ZoneUpdateCtrl', ['$scope', 'ZoneService', 'DeviceService', function($scope, ZoneService, DeviceService	) {
		
		
		var removeDeviceFromArray = function(id, array){
			console.log("ID ->"+id);
			console.log("array.len ->"+array.length);
			for(var i = array.length - 1; i >= 0; i--) {
				if(array[i]._id === id) {
					console.log("split ->"+i);
				   array.splice(i, 1);
				   break;
				}
			}			
		}
		
		
		//Get All Devices
		deviceQuery = DeviceService.query().$promise;
		
		deviceQuery.then(function(response) {
			if (response.result) {
				$scope.devices = [];
				
				for(var i = 0; i < response.result.length; i++) {
					$scope.devices.push({_id: response.result[i]._id, id : response.result[i].id, name : response.result[i].name});
				}
				
				console.log("result");
				console.log(response.result);
				console.log($scope.devices);
				
				console.log("ZONE");
				console.log($scope.zone);
				//Remove from devices list the devices in zone
				for(var i = 0; i < $scope.zone.devices.length; i++) {
					removeDeviceFromArray($scope.zone.devices[i]._id,$scope.devices);
				}				
			}
		}, function(reason) {
			  console.log('Failed get devices: ' + reason);
		});
		
		
		
		$scope.moveLeft = function() {
			console.log("Move Left");
			if($scope.selected){
				var device = $scope.selected;
				$scope.selected = undefined;
				$scope.devices.push(device);
				removeDeviceFromArray(device._id, $scope.zone.devices);
			}


		};
		
		$scope.moveRight = function() {
			console.log("Move Right");
			if($scope.selected){
				var device = $scope.selected;
				$scope.selected = undefined;
				$scope.zone.devices.push(device);
				removeDeviceFromArray(device._id, $scope.devices);
			}
		};
		
		$scope.moveAllLeft = function() {
			console.log("Move All Left");
		};
		
		$scope.moveAllRight = function() {
			console.log("Move All Right");
		};

		
		$scope.updateZU = function() {
			
			if(!$scope.newZone){
				console.log("UPDATE ZONE");
				console.log($scope.zone);
				
				zoneUpdate = ZoneService.update({entryId:$scope.zone._id},$scope.zone).$promise;
			
				zoneUpdate.then(function(response) {
					if (response.result) {
						$scope.$parent.$close('update zone');
					}
				}, function(reason) {
					  console.log('Failed ZoneUpdateCtrl: ' + reason);
				});
			}else{
				console.log("NEW ZONE");
				console.log($scope.zone);
				
				zoneCreate = ZoneService.post($scope.zone).$promise;
			
				zoneCreate.then(function(response) {
					if (response.result) {
						$scope.gridOptions.data.push($scope.zone);
						$scope.$parent.$close('created zone');
					}
				}, function(reason) {
					  console.log('Failed ZoneUpdateCtrl: ' + reason);
				});

				
			}
		};
		
		$scope.cancelZU = function () {
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
	var response = $resource(apiVer+'zone/:entryId', {}, {
			query: { method: 'GET', params: {} },
			post: {method:'POST'},
			update: {method:'PUT', params: {entryId: '@entryId'}},
			remove: {method:'DELETE'}
    });
    return response;

}]);
  







