
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var messageSchema = new Schema({
	level: { type: String},
	message : { type: Boolean},
	locationId : { type: Schema.Types.ObjectId, required: true},
	insertDate: Date
});

messageSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.insertDate = currentDate;
  next();
});

// the schema is useless so far
// we need to create a model using it
var Message = mongoose.model('Message', messageSchema);

// make this available to our users in our Node applications
module.exports = Message;