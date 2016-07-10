var dgModuleWebCam = angular.module('dgModuleWebCam', ['ngResource','ui.bootstrap']);

var socket;

dgModuleWebCam.controller('WebCamCtrl', ['$scope',  function($scope) {
		
		$scope.image_src = "ciao";
		if(socket) socket.disconnect();
		socket = io();
		socket.emit('start-stream');
		socket.on('liveStream', function(url) {
			console.log("liveStream");
			console.log(url);
			$scope.image_src = url;
		}); 
		
		
		
}]);


