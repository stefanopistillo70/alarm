
var logger = require('../config/logger.js')('Crontab');

var CronJob = require('cron').CronJob;

var Device = require('../models/device');
var Location = require('../models/location');
var User = require('../models/user');

var jobSendAlarmReport = function() {
		console.log('check event');
		const DAYS = 1;
		var date1 = new Date() - 1000;
		console.log(date1);
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
								var deviceStatus = { name : device.name, status : status};
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
											//sendGoogleMailToUsers(adminUser,user,message);
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

	var msg = '<table style="width:100%">'
	msg += '<tr>';
    msg += '<th>Device</th>';
    msg += '<th>Status</th>';
	msg += '</tr>';
	
	for(i = 0 ; i < deviceStatusArray.length; i++ ){
		msg += '<tr>';
		msg += '<td>'+deviceStatusArray[i].name+'</td>';
		msg += '<td>'+deviceStatusArray[i].status+'</td>';
		msg += '</tr>';
	}
 
	msg += '</table>';
	return msg;
}

var crontab = function(){
	
	logger.info("Start Crontab Jobs");
	
	new CronJob('0 * * * * *', jobSendAlarmReport, null, true, 'America/Los_Angeles');
	
	return false;
}


module.exports = crontab;