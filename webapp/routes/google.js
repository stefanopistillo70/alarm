
var express = require('express');
var router = express.Router();

var logger = require('../config/logger.js')('Web');

var Response = require('./response');
var User       = require('../models/user');


//Save GCM
router.post('/saveGCM', function(req, res, next) {
	logger.info("Save GCM");
	
	var orig_gcm = req.body.gcm;
	
	https://android.googleapis.com/gcm/send/

	var gcm = orig_gcm.replace("https://android.googleapis.com/gcm/send/", "");
	logger.info("GCM ->"+gcm);
	
	
	var userId = req.userId;
	query = { _id : userId};
	
		User.findOne(query, function(err, user) {
		
			if (err){
				logger.error(err);
				return res.status(400).send(new Response().error(400,err.errors));
			}	

			if (user) {
				
				var update = { 'google.gcm.web': gcm};
				var opts = { strict: true };
				User.update(query, update, opts, function(error,raw) {
					if (error){
						res.status(400).send(new Response().error(400,error));
					}else{
						res.json(new Response());
					} 		  
				});			
			}
		});

});



//Sample GMail 
router.get('/sendMail', function(req, res, next) {
	console.log("Send Gmail message");
	
	var gmail = google.gmail('v1');
	
	var email = "stefano.pistillo@gmail.com";
	
	var query = { 'google.email' : email }
	User.findOne(query, function(err, user) {
	
		if (err) res.status(400).send(new Response().error(400,err.errors));
			
		if (user) {
			
			oauth2Client.setCredentials({
				access_token: user.auth.google.token,
				refresh_token: user.auth.google.refresh_token
			}); 
			
			console.log(oauth2Client);
			
			
			var to = 'someone@someone.nl',
			subject = 'Hello World',
			content = 'send a Gmail.'

			var base64EncodedEmail = new Buffer(
			  "Content-Type:  text/plain; charset=\"UTF-8\"\n" +
			  "Content-length: 5000\n" +
			  "Content-Transfer-Encoding: message/rfc2822\n" +
			  "to: stefano.pistillo@gmail.com\n" +
			  "from: \"Stefano Pistillo\" <stefano.pistillo@gmail.com>\n" +
			  "subject: Hello world\n\n" +

			  "The actual message text goes here"
				).toString("base64").replace(/\+/g, '-').replace(/\//g, '_');

			var mail= base64EncodedEmail;
			
			
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
					  res.json(new Response("Mail Sent"));
					}
					if(response){
						console.log(response);
						res.json(new Response("Mail Sent"));
					}
					
			 })
			
			/*gmail.users.labels.list({
				auth: oauth2Client,
				userId: 'me',
				}, function(err, response) {
					if (err) {
					  console.log('The API returned an error: ' + err);
					  res.json(new Response("Mail Sent"));
					}
					if(response){
						var labels = response.labels;
						if (labels.length == 0) {
						  console.log('No labels found.');
						} else {
						  console.log('Labels:');
						  for (var i = 0; i < labels.length; i++) {
							var label = labels[i];
							console.log('- %s', label.name);
						  }
						}
						
						res.json(new Response("Mail Sent"));
					}
					
			});*/
				
		};
		
	});

	
	//res.json(new Response("Mail Sent"));
	
	
});


module.exports = router;




