var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var trainingSetSchema = new Schema({
	input : Array,
	output : Array
});

module.exports = mongoose.model('trainingSet', trainingSetSchema);