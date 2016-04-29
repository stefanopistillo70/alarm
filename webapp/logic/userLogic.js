
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
					console.log("location");
					console.log(location);
					newUser.locations = [];
					newUser.locations.push(location._id);
					
					console.log("NEW User");
					console.log(newUser);
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
				console.log(err);
			}	

			if (location) {
				
				console.log("Location Found token ->"+location.controller.controllerId);

				var update = { "config.hasNewUpdates" : value };
				var opts = { strict: true };
				Location.update({'_id' : location._id}, update, opts, function(error,raw) {
					if (error){
						console.log("Error on update location config : "+error);
					} 		  
				});		

			}else{
				console.log("userUpdate Problem: no location found");
			}
		});

	}
	
	
}


module.exports = logic;