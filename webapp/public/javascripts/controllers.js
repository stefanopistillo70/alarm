var dgControllers = angular.module('dgControllers', []);

dgControllers.controller('EventLogList', ['$scope', 'EventLog', function($scope, EventLog) {
//sensorLogControllers.controller('SensorLogList', ['$scope', '$http', function($scope, $http) {
		
		//var result = SensorLog.query();
		//console.log("SENSORS ->"+result);
		
		/*$http.get('sensorLog').success(function(data) {
				console.log("Data->"+data);
				var p = JSON.parse(data);
				console.log("Data->"+p);
			  $scope.sensorLog = JSON.parse(data);
		});
*/
		var eventLogQuery = EventLog.query().$promise;
		
		eventLogQuery.then(function(response) {
			if(response.result){
			$scope.eventLog = response.result
			}
		},
		function(reason) {
			  console.log('Failed eventLogQuery: ' + reason);
		});
		
}]);



dgControllers.controller('DeviceList', ['$scope', 'Device', function($scope, Device) {
		
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
		
		deviceQuery = Device.query().$promise;
		
		deviceQuery.then(function(response) {
			if (response.result) {
				$scope.gridOptions.data = response.result;
			}
		}, function(reason) {
			  console.log('Failed DeviceList: ' + reason);
		});
		
}]);




dgControllers.controller('ModalDemoCtrl', function ($scope, $uibModal, $log) {


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

dgControllers.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, Device, Config) {


	var queryConfig = Config.query().$promise;
	
	queryConfig.then(function(result) {
		
		var id = result[0]._id;
		
		console.log(id);
		
		var updateConfigTrue = Config.update({entryId:id}, {enableNewDevice : true}).$promise;
		
		updateConfigTrue.then(function(result) {
	  
		  $scope.progress = true;
		  $scope.formUpdateDevice  = true;

		  var checkForDB = { value : true}
		  
		  $scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
			Config.update({entryId:id}, {enableNewDevice : false});
			checkForDB.value = false;
		  };
		  
		  checkDb(checkForDB, Device, -1, Date.now(), $uibModalInstance, Config);
		  
		}, 
		function(reason) {
			  console.log('Failed: ' + reason);
		});
		
	}, 
	function(reason) {
		  console.log('Failed: ' + reason);
	});
  
});


var checkDb = function(checkForDB, Device, initialValue, initialDate, $uibModalInstance, Config){
	
	if(checkForDB.value){
		
		var now = Date.now();
		if((Date.now() - initialDate) < 10000){
			console.log('check db');
			var deviceQuery = Device.query().$promise;
			
			deviceQuery.then(function(result) {
			  
				if(result) console.log('Initial ->'+initialValue+'   n rec ->'+result.length);
				
				if(initialValue === -1) initialValue = result.length;
				else{
					if(result.length > result.length){
						$uibModalInstance.close('found new device');
						Config.update({entryId:0}, {enableNewDevice : false});
						return;
					} 
				}
				setTimeout(checkDb.bind(null, checkForDB, Device, initialValue, initialDate, $uibModalInstance, Config),3000);
			  
			}, function(reason) {
			  console.log('Failed: ' + reason);
			});
		}else{
			console.log('check DB timeout');
			$uibModalInstance.dismiss('timeout');
			Config.update({entryId:0}, {enableNewDevice : false});
			return;
		}
		
		
	};
};





