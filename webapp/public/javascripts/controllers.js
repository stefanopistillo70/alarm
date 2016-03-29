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
		
		$scope.eventLog = EventLog.query();
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
		
		$scope.gridOptions.data = Device.query();
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

    modalInstance.result.then(function (selectedItem) {
      $scope.selected = selectedItem;
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
		
		var updateConfig = Config.update({entryId:id}, {enableNewDevice : true}).$promise;
		
		updateConfig.then(function(result) {
	  
		  $scope.progress = true;
		  $scope.formUpdateDevice  = true;

		  var checkForDB = { value : true}
		  
		  $scope.cancel = function () {
			$uibModalInstance.dismiss('cancel');
			checkForDB.value = false;
		  };
		  
		  checkDb(checkForDB, Device)
		}, 
		function(reason) {
			  console.log('Failed: ' + reason);
		});
		
	}, 
	function(reason) {
		  console.log('Failed: ' + reason);
	});
  
});


var checkDb = function(checkForDB, Device){
	
	
	if(checkForDB.value){
		console.log('check db');
		var promise = Device.query();
		
		console.log(promise.$promise);
		
		promise.$promise.then(function(result) {
		  
			if(result) console.log('n rec ->'+result.length);
			setTimeout(checkDb.bind(null, checkForDB, Device),3000);
		  
		}, function(reason) {
		  console.log('Failed: ' + reason);
		});
		
		
	};
};





