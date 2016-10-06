
var logger = require('../config/logger.js')('Crontab');

var CronJob = require('cron').CronJob;

var Device = require('../models/device');
var Location = require('../models/location');
var User = require('../models/user');

var userLogic = require('./userLogic');


var jobCheckControllerAlive = function() {
		console.log('Job Check Controller Alive');
		var query = {};
		Location.find(query, function(err, locations) {
			if (err) {
				console.log(err);
			}else{
				for (i = 0; i < locations.length; i++) { 
					var locationID = locations[i]._id;
					console.log("Location ->"+locationID);
					var now = new Date();
					if(((now - locations[i].controller.lastCheck) > 70 * 1000) && (locations[i].controller.connectionAlarm == false)){
							var msg = "Your Location :"+locations[i].name+" is unreachable";
														
							query = { "locations._id" : locationID}
							User.find(query,function(err, users){
								if(err){
									console.log(err);
								}else{
									//console.log(users);

									//search admin user
									var adminUser;
									for (var i = 0; i < users.length; i++) {
										if(users[i].auth.role == "admin"){
											adminUser = users[i];
										}
									}
									
									for(i = 0 ; i < users.length; i++ ){
											console.log("Send mail to user ->"+users[i].auth.local.email);
											var subject = "DomusGuard Alarm Location Unreachable";
											userLogic.sendGoogleMailToUser(adminUser,users[i],subject,msg);
									}
									
									query = {_id : locationID};
									update = {"controller.connectionAlarm" : true}
									Location.update(query,update, function(err, locations) {
										if(err) console.log(err);
										else{
											console.log("Last check date updated.");
										}
									});

								}
							});
					}		
				}
			} 
		});
};




var jobSendAlarmReport = function() {
		console.log('Job Send Alarm Report');
		const DAYS = 1;
		var query = {};
		Location.find(query, function(err, locations) {
			if (err) {
				console.log(err);
			}else{
				for (i = 0; i < locations.length; i++) { 
					var locationID = locations[i]._id;
					console.log("Location ->"+locationID);
					var query = { locationId : locationID};
					Device.find(query,function(err, devices){
						if(err){
							console.log(err);
						}else{
							
							var deviceStatusArray = [];
							
							for (i = 0; i < devices.length; i++) {
								var device = devices[i];
								var status  = "OK";
								if(device.events.length > 0){
									var now = new Date();
									if((now - device.events[0].date)  > (DAYS * 86400000) ){
										status = "NOK";
									}
								}
								var deviceStatus = { name : device.name, status : status, event : (device.events[0] != undefined)? device.events[0].date: "" };
								console.log(deviceStatus);
								deviceStatusArray.push(deviceStatus);
							}
							
							var msg = buildStatusReportMail(deviceStatusArray);
							
							console.log(msg);
							
							
							query = { "locations._id" : locationID}
							User.find(query,function(err, users){
								if(err){
									console.log(err);
								}else{
									//console.log(users);

									//search admin user
									var adminUser;
									for (var i = 0; i < users.length; i++) {
										if(users[i].auth.role == "admin"){
											adminUser = users[i];
										}
									}
									
									for(i = 0 ; i < users.length; i++ ){
											console.log("Send mail to user ->"+users[i].auth.local.email);
											var subject = "DomusGuard Daily Sensor Report";
											userLogic.sendGoogleMailToUser(adminUser,users[i],subject,msg);
									}
									

								}
							});
							
						}
					});
				}
			} 
		});
};


var buildStatusReportMail = function(deviceStatusArray){

	var msg = '<html><head></head><body><table style="width:100%">'
	msg += '<tr>';
    msg += '<th>Device</th>';
    msg += '<th>Status</th>';
	msg += '<th>Last Event</th>';
	msg += '</tr>';
	
	for(i = 0 ; i < deviceStatusArray.length; i++ ){
		msg += '<tr>';
		msg += '<td>'+deviceStatusArray[i].name+'</td>';
		msg += '<td>'+deviceStatusArray[i].status+'</td>';
		msg += '<td>'+deviceStatusArray[i].event+'</td>';
		msg += '</tr>';
	}
 
	msg += '</table></body></html>';
	return msg;
}

var crontab = function(){
	
	logger.info("Start Crontab Jobs");
	
	new CronJob('0 0 8 * * *', jobSendAlarmReport, null, true, 'Europe/Rome');
	
	new CronJob('0 * * * * *', jobCheckControllerAlive, null, true, 'Europe/Rome');
	
	return false;
}


module.exports = crontab;