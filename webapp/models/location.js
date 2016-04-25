


var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var locationSchema = new Schema({
	name: { type: String},
	router_ip : { type: String},
	controllerId : { type: String},
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