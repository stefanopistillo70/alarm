
var logger = require('../config/logger.js')('UserLogic');

var User       = require('../models/user');
var Location       = require('../models/location');

var Client = require('node-rest-client').Client;
var client = new Client();

var sysConfig = require('config');
var googleConf = sysConfig.get("google");

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var oauth2Client = new OAuth2(googleConf.auth.clientID, googleConf.auth.clientSecret, googleConf.auth.callbackURL);
var gmail = google.gmail('v1');
var nodemailer = require('nodemailer');

var logic = {
	
	createUser : function(newUser, router_ip, callback){
		
			var onlyOneLocation = sysConfig.get('onlyOneLocation');
			
			var countLocation = 0;
			Location.count({}, function(err, countLocation) {
				logger.info('Locations : ' + countLocation);
				
				if((onlyOneLocation && countLocation===0) || (!onlyOneLocation) || (countLocation === "undefined")){
					//create location
					logger.info('Creating a location...');
					
					var newLocation = new Location();
					newLocation.name = "Default Location";
					newLocation.router_ip = router_ip;
					newLocation.config = { };
					newLocation.config.enableNewDevice = false;
					
					newLocation.save(function(err, location) {
						if (err) callback(err);
						else {
							logger.info("Created a new location with router ip : "+router_ip);
							newUser.auth.role = "admin";
							newUser.locations = [];
							newUser.locations.push(location._id);
							
							// save the user
							newUser.save(function(err) {
								callback(err);
							});
						}
					});
				}else callback("Error : Only One Location is possible");
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
			}	

			if (users) {
				logger.info("Users ->"+users.length);
				
				//search admin user
				var adminUser;
				for (var i = 0; i < users.length; i++) {
					if(users[i].auth.role == "admin"){
						adminUser = users[i];
					}
				}
				
				for(i = 0 ; i < users.length; i++ ){
					sendPushNotification(users[i],function(success,user){
						console.log("SUCCESS->"+success);
						if(!success) sendGoogleMailToUsers(adminUser,user,message);
						//if(!success) sendMailToUsers(user,message);
					});
				}
			}
		});
	}
}

var sendPushNotification = function(user, callback){
		
	logger.info("Send Notification to ->"+user.auth.local.name);
	
	var args = {
		data: { 
				"data": { },
				"to" : user.google.gcm.web
			  },
		headers: { "Content-Type": "application/json", "Authorization" : "key="+googleConf.gcm }
	};
	
	var onResponseEvent = function(data, response) {
//		console.log("GCM Response ->");
//		console.log(data);
		if(response.statusCode == 200){
				logger.log('info',"Response arrived");
				if(data.success === 1 ){
					logger.log('info',"Push sent.");
					callback(true,user);
				}else callback(false,user);
		}else{
			logger.error(data);
			callback(false,user);
		} 
	};

	client.post("https://gcm-http.googleapis.com/gcm/send", args, onResponseEvent).on('error', function (err) {
		logger.error("Connection problem for "+err.address+":"+err.port+" -> "+ err.code);
		callback(false,user);
	});
		
};
	
	

	
var	sendGoogleMailToUsers = function(adminUser, user, msg){
console.log(user);
	logger.info("Send Google Mail to ->"+user.auth.local.email);
		
	if(adminUser.auth.google.refresh_token){
	
		//Prepare email
		var to = user.auth.local.email,
		subject = 'DomusGuard '+msg.level+' Message',
		content = msg.message;

		var buff = new Buffer(
			"Content-Type:  text/plain; charset=\"UTF-8\"\n" +
			"Content-length: 5000\n" +
			"Content-Transfer-Encoding: message/rfc2822\n" +
			"to: "+to+"\n" +
			"from: <"+adminUser.auth.local.email+">\n" +
			"subject: "+subject+"\n\n" +
			content
		);
					
		var base64EncodedEmail = buff.toString("base64").replace(/\+/g, '-').replace(/\//g, '_');

		var mail = base64EncodedEmail;
		
		
		oauth2Client.setCredentials({
			access_token: adminUser.auth.google.token,
			refresh_token: adminUser.auth.google.refresh_token
		}); 

		var now = (new Date()).getTime();
			
		if(!((adminUser.auth.google.expiry_date) && ((adminUser.auth.google.expiry_date - now) > 0))){
			logger.info("Token is expired. refresh");
			oauth2Client.refreshAccessToken(function(err, tokens) {
				
				if (err){
						logger.error(err);
				}else{
				
					var query = { '_id' : adminUser._id };
					var updates = { 'auth.google.expiry_date' : tokens.expiry_date, 'auth.google.token' : tokens.access_token};
					User.findOneAndUpdate(query, updates, function(err, user) {
						if (err){
							logger.error(err.errors);
						}else{
							
							gmail.users.messages.send({
								'auth': oauth2Client,
								'userId' : 'me',
								//uploadType : 'media',
								'resource': {
									  'raw': mail
									}
								}, function(err, response) {
									if (err) {
									  logger.error(err);
									}
									if(response){
										logger.info("Email sent.");
									}
							});	

						}	
					});
				}

			});
		}else{
			
			gmail.users.messages.send({
				'auth': oauth2Client,
				'userId' : 'me',
				'resource': {
					  'raw': mail
					}
				}, function(err, response) {
					if (err) {
					  logger.error(err);
					}
					if(response){
						logger.info("Email sent.");
					}
			});
			
		}	
	}else{
		logger.error("Google email not configured");
	}
};



var	sendMailToUsers = function(user, msg){
	
	logger.info("Send Mail to ->"+user.auth.local.email);
	
	// create reusable transporter object using the default SMTP transport 
	var smtpUser = "pistillo.stefano%40libero.it";
	var smtpPwd = "Magacirce1";
	var smtp = "smtps://"+smtpUser+":"+smtpPwd+"@smtp.libero.it";
	//var transporter = nodemailer.createTransport('smtps://pistillo.stefano%40libero.it:Magacirce1@smtp.libero.it');
	
	logger.info("URL ->"+smtp);
	var transporter = nodemailer.createTransport(smtp);
	 
	// setup e-mail data with unicode symbols 
	var mailOptions = {
		from: '<pistillo.stefano@libero.it>', // sender address 
		to: user.auth.local.email, // list of receivers 
		subject: 'DomusGuard', // Subject line 
		text: msg, // plaintext body 
		html: '<b>Hello world</b>' // html body 
	};
	 
	// send mail with defined transport object 
	transporter.sendMail(mailOptions, function(error, info){
		if(error){
			logger.error(error);
			return;
		}else if(info){
			logger.info('Message sent: ' + info.response);
		}
	});

};




module.exports = logic;