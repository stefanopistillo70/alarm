
var logger = require('../config/logger.js')('Web');

var User       = require('../models/user');
var Location       = require('../models/location');

var Client = require('node-rest-client').Client;
var client = new Client();



//TODO put on config file	
var configAuth = {
	   'googleAuth' : {
        'clientID'      : '347967676922-9lsavri7424fsn1bmjcoepm3tme8bbfd.apps.googleusercontent.com',
        'clientSecret'  : 'crk3KvehjxYlukK1z4U9TZPP',
        'callbackURL'   : 'http://localhost:3000'
    }
};

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(configAuth.googleAuth.clientID, configAuth.googleAuth.clientSecret, configAuth.googleAuth.callbackURL);
var gmail = google.gmail('v1');

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
					//sendPushNotification(users[i]);
					sendGoogleMailToUsers(users[i],message);
				}
			}
		});
	}
	
}


var sendPushNotification = function(user){
		
		logger.info("Send Notification to ->"+user.name);
		
		//TODO key in properties
		var args = {
			data: { 
					"data": { },
					"to" : user.google.gcm.web
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
		
	};
	
	

	
var	sendGoogleMailToUsers = function(user, msg){
			logger.info("Send Mail to ->"+user.auth.local.email);
			

			oauth2Client.setCredentials({
				access_token: user.auth.google.token,
				refresh_token: user.auth.google.refresh_token
			}); 
			
			console.log(oauth2Client);
			
			//TODO find admin user in location
			var adminUser = user;
			
			var to = user.auth.local.email,
			subject = 'DomusGuard Message',
			content = 'send a Gmail.';

			/*var buff = new Buffer(
				"Content-Type:  text/plain; charset=\"UTF-8\"\n" +
				"Content-length: 5000\n" +
				"Content-Transfer-Encoding: message/rfc2822\n" +
				"to: "+to+"\n" +
				"from: <"+adminUser.auth.local.email+">\n" +
				"subject: "+subject+"\n\n" +
				content
			);*/
			
			var buff = new Buffer(
			  "Content-Type:  text/plain; charset=\"UTF-8\"\n" +
			  "Content-length: 5000\n" +
			  "Content-Transfer-Encoding: message/rfc2822\n" +
			  "to: stefano.pistillo@gmail.com\n" +
			  "from: \"Stefano Pistillo\" <stefano.pistillo@gmail.com>\n" +
			  "subject: Hello world\n\n" +

			  "The actual message text goes here"
				);
			
			
			
			var base64EncodedEmail = buff.toString("base64").replace(/\+/g, '-').replace(/\//g, '_');

			var mail = base64EncodedEmail;
			
			
			gmail.users.messages.send({
				'auth': oauth2Client,
				'userId' : 'me',
				//uploadType : 'media',
				'resource': {
					  'raw': mail
					}
				}, function(err, response) {
					if (err) {
					  console.log('The API returned an error: ' + err);
					}
					if(response){
						console.log(response);
					}
			});			
	};





module.exports = logic;