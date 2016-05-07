
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// create a schema
var userSchema = new Schema({
	location_view : Schema.Types.ObjectId,
	locations : { type:[{_id : Schema.Types.ObjectId}] , required: true},
	auth : {
	  local	: { email: { type: String, unique : true, required : true},
				token: { type: String, required : true}, 
				refresh_token: String , 
				name: String, 
				expiry_date : Date, 
				pwd : String, 
				salt : String },
	  google: { email: String, 
				token: String, 
				refresh_token: String, 
				expiry_date : Date }
	},
	google : {
		gcm : { web : String, app : String}
	},
	insertDate: Date
});


userSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.insertDate = currentDate;
  next();
});

// the schema is useless so far
// we need to create a model using it
var User = mongoose.model('User', userSchema);

// make this available to our users in our Node applications
module.exports = User;