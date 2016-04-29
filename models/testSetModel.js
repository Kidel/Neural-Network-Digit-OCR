var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var testSetSchema = new Schema({
	input : Array,
	output : Array
});

module.exports = mongoose.model('testSet', testSetSchema);