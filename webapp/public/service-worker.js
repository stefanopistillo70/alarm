

'use strict';


self.addEventListener('install', function(event) {
	self.skipWaiting();
	console.log('Installed', event);
});
self.addEventListener('activate', function(event) {
	console.log('Activated', event);
});


//TODO change self.token with true token
self.addEventListener('push', function(event) {  
  // Since there is no payload data with the first version  
  // of push messages, we'll grab some data from  
  // an API and use it to populate a notification  
  event.waitUntil(  
		self.registration.pushManager.getSubscription().then(function(subscription) {
			fetch('/api/1.0/message/last', {
				method: 'post',
				headers: {
				'x-access-token': subscription.endpoint,
				'Accept': 'application/json',
				'Content-Type': 'application/json'
				},
				body: {}
			})
			.then(function(response) { return response.json(); })
			.then(function(data) {
				console.log("***********");
				console.log(data);
				var title = "Message "+ data.result.level;
				var body = data.result.message;
				self.registration.showNotification(title, {
					body: body,
					icon: 'favicon.ico'
				});
			})
			.catch(function(err) {
				console.log('err');
				console.log(err);
			});
		})
	);  
});






