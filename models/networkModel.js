var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var networkSchema = new Schema({
    network : String
});

module.exports = mongoose.model('network', networkSchema);