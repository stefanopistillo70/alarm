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
		
		$scope.device = Device.query();
}]);




dgControllers.controller('ModalDemoCtrl', function ($scope, $uibModal, $log) {


  $scope.animationsEnabled = true;

  $scope.open = function (size) {

    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'loadingModalContent.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      resolve: {
        items: function () {
          return $scope.items;
        }
      }
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

dgControllers.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

  $scope.loading = true;

  var checkForDB = { value : true}
  
  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
	checkForDB.value = false;
  };
  
  checkDb(checkForDB)
  
});


var checkDb = function(checkForDB){
	if(checkForDB.value){
		console.log('check db');
		setTimeout(checkDb.bind(null, checkForDB),3000);
	};
};





