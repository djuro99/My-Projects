var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var QuestionsSchema = new Schema({
	'response_code': Number,
	'results' : Array,
	'category' : String
});

module.exports = mongoose.model('Questions', QuestionsSchema);
