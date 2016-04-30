		  
		  
		  
		  
if ('serviceWorker' in navigator) {
  console.log('Service Worker is supported');
  navigator.serviceWorker.register('service-worker.js').then( function() {
	  console.log('Service registered');
    return navigator.serviceWorker.ready;
  }).then(function(reg) {
    console.log('Service Worker is ready', reg);
    reg.pushManager.subscribe({userVisibleOnly: true}).then(function(sub) {
		console.log('endpoint:', sub.endpoint);
	  
		console.log("save gcm endpoint");
		
		var token = getCookie("token");
		console.log("token ->"+token);

		if(token){
			var data = "gcm="+sub.endpoint;

			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4) {
					console.log("Gcm Saved");
				}
			}
			xhttp.open("POST", apiVer+"google/saveGCM", false);
			xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
			xhttp.setRequestHeader("x-access-token", token);
			xhttp.send(data);
		}
	  
    });
  }).catch(function(error) {
    console.log('Service Worker Error  :', error);
  });
}



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

