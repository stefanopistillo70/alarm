


var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var locationSchema = new Schema({
	name: { type: String},
	router_ip : { type: String},
	controller : { controllerId : String,
				   token : String,
				   refresh_token : String,
				   lastCheck : Date
				},
	config : {enableNewDevice: { type: Boolean, default: false }, hasNewUpdates : { type: Boolean, default: false }},
	insertDate: Date
});


locationSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.insertDate = currentDate;
  next();
});

// the schema is useless so far
// we need to create a model using it
var Location = mongoose.model('Location', locationSchema);

// make this available to our users in our Node applications
module.exports = Location;