		  
		  
		  
		  
if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');
  navigator.serviceWorker.register('service-worker.js').then( function() {
	  console.log('Service registered');
    return navigator.serviceWorker.ready;
  }).then(function(reg) {
    console.log('Service Worker is ready', reg);
    reg.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {
      console.log('endpoint:', sub.endpoint);
	  
	  
	  
	  
    });
  }).catch(function(error) {
    console.log('Service Worker Error  :', error);
  });
}
