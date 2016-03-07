
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var sensorLogSchema = new Schema({
  node: { type: String, required: true},
  sensor: { type: String, required: true},
  cmd: { type: String, required: true },
  ack: { type: Boolean, required: true },
  type: { type: String, required: true },
  location: String,
  insertDate: Date
});

sensorLogSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.insertDate = currentDate;
  next();
});

// the schema is useless so far
// we need to create a model using it
var SensorLog = mongoose.model('SensorLog', sensorLogSchema);

// make this available to our users in our Node applications
module.exports = SensorLog;