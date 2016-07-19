
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema


var deviceSchema = new Schema({
  id: { type: String, required: true, unique: true, dropDups: true},
  name: { type: String},
  deviceType : { type: String, enum : ['Remote Control','Sensor','']},
  technology : { type: String, enum : ['433','NRF24'], required: true },
  locationId : { type: Schema.Types.ObjectId, required: true}, 
  sensors: [
		{ 
			id: { type: String, required: true},
			name: { type: String},
			description: { type: String},
			type:  { type: String},
			value: { type: String}
		} 
  ],
  events: [ {date: Date}],
  batteryLevel : String,
  insertDate: Date
});


deviceSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.insertDate = currentDate;
  next();
});

// the schema is useless so far
// we need to create a model using it
var Device = mongoose.model('Device', deviceSchema);

// make this available to our users in our Node applications
module.exports = Device;
