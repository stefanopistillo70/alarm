
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var zoneSchema = new Schema({
  name: { type: String},
  armed : { type: Boolean},
  devices: [{id : String}],
  insertDate: Date
});


zoneSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.insertDate = currentDate;
  next();
});

// the schema is useless so far
// we need to create a model using it
var Zone = mongoose.model('Zone', zoneSchema);

// make this available to our users in our Node applications
module.exports = Zone;