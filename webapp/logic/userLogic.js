
var logger = require('../config/logger.js')('Web');

var User       = require('../models/user');
var Location       = require('../models/location');


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
					logger.info("location");
					logger.info(location);
					newUser.locations = [];
					newUser.locations.push(location._id);
					
					logger.info("NEW User");
					logger.info(newUser);
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

	}
	
	
}


module.exports = logic;