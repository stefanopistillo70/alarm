
var logger = require('../config/logger.js')('Web');

var User       = require('../models/user');
var Location       = require('../models/location');

var Client = require('node-rest-client').Client;
var client = new Client();

var logic = {
	
	createUser : function(newUser, router_ip, callback){
		
			//create location
			
			var newLocation = new Location();
			newLocation.name = "Default Location";
			newLocation.router_ip = router_ip;
			newLocation.config = { };
			newLocation.config.enableNewDevice = false;
			
			newLocation.save(function(err, location) {
				if (err) res.status(400).send(new Response().error(400,err.errors));
				else {
					logger.info("Created a new location with router ip : "+router_ip);
					newUser.locations = [];
					newUser.locations.push(location._id);
					
					// save the user
					newUser.save(function(err) {
						callback(err);
					});
					
				}
			});
	},
	
	
	userUpdateHasNewUpdates : function(locationId, value){
		
		var query = { '_id' : locationId }
		Location.findOne(query, function(err, location) {
			if (err){
				logger.error(err);
			}	

			if (location) {
				
				logger.info("Location Found token ->"+location.controller.controllerId);

				var update = { "config.hasNewUpdates" : value };
				var opts = { strict: true };
				Location.update({'_id' : location._id}, update, opts, function(error,raw) {
					if (error){
						logger.error("Error on update location config : "+error);
					} 		  
				});		

			}else{
				logger.error("userUpdate Problem: no location found");
			}
		});
	},
	
	
	sendNotifyToAllUsers : function(locationId, message){
		logger.info("Send notificatios");
		
		var query = { 'locations' : {
							$elemMatch: {
								 _id: locationId
							} 
						}
					};

		User.find(query, function(err, users) {
			
			if (err){
				logger.error(err);
				return res.status(400).send(new Response().error(400,err));
			}	

			if (users) {
				logger.info("Users ->"+users.length);
				for(i = 0 ; i < users.length; i++ ){
					logger.info("Send Notification to ->"+users[i].email);
					
					var args = {
						data: { 
								"data": { "score": "5x1", "time": "15:10" },
								"to" : users[i].google.gcm.web
							  },
						headers: { "Content-Type": "application/json", "Authorization" : "key=AIzaSyDSg-NrkWSxeMtxK7wAY7urk8_r2U9aW0s" }
					};
					
					var onResponseEvent = function(data, response) {
						console.log("GCM Response ->");
						console.log(data);
						if(response.statusCode == 200){
								logger.log('info',"Response arrived");
						}else{
							logger.error(data.errors);
						} 
					};

					
					client.post("https://gcm-http.googleapis.com/gcm/send", args, onResponseEvent).on('error', function (err) {
						logger.error("Connection problem for "+err.address+":"+err.port+" -> "+ err.code);
						setTimeout(registerController.bind(this,controllerId,callback),10000);
					});

				}
			}
		});
		
	}
	
	
}


module.exports = logic;