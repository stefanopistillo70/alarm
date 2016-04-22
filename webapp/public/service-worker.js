

'use strict';

console.log('Started', self);
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
			fetch('/api/1.0/message/', {
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
				var title = "Message "+ data.result.level;
				var body = data.result.message;
				self.registration.showNotification(title, {
					body: body,
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



function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}


