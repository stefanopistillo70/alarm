
var User       = require('../models/user');
var Location       = require('../models/location');


var logic = {
	
	createUser : function(newUser, callback){
		
			//create location
			
			var newLocation = new Location();
			newLocation.name = "Default Location";
			
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
		
	}
}


module.exports = logic;