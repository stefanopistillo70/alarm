
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema

var configSchema = new Schema({
    enableNewDevice: { type: Boolean, default: false }
});


// the schema is useless so far
// we need to create a model using it
var Config = mongoose.model('Config', configSchema);



// make this available to our users in our Node applications
module.exports = Config;