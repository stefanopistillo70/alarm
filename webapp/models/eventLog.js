
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var eventLogSchema = new Schema({
  device: { type: String, required: true},
  sensor: { type: String},
  event: { type: String, required: true },
  insertDate: Date
});

eventLogSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.insertDate = currentDate;
  next();
});

// the schema is useless so far
// we need to create a model using it
var EventLog = mongoose.model('EventLog', eventLogSchema);

// make this available to our users in our Node applications
module.exports = EventLog;