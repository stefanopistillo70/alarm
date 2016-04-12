

'use strict';

console.log('Started', self);
self.addEventListener('install', function(event) {
	self.skipWaiting();
	console.log('Installed', event);
});
self.addEventListener('activate', function(event) {
	console.log('Activated', event);
});



self.addEventListener('push', function(event) {  
  // Since there is no payload data with the first version  
  // of push messages, we'll grab some data from  
  // an API and use it to populate a notification  
  event.waitUntil(  
		self.registration.pushManager.getSubscription().then(function(subscription) {
			fetch('/notifications/', {
				method: 'post',
				headers: {
				'Authorization': 'Bearer ' + self.token,
				'Accept': 'application/json',
				'Content-Type': 'application/json'
				},
				body: JSON.stringify(subscription)
			})
			.then(function(response) { return response.json(); })
			.then(function(data) {
				self.registration.showNotification(data.title, {
					body: data.body,
					icon: 'favicon-196x196.png'
				});
			})
			.catch(function(err) {
				console.log('err');
				console.log(err);
			});
		})
	);  
});
