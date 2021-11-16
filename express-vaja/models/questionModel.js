var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var questionSchema = new Schema({
	'title' : String,
	'description' : String,
	'tags' : String,
	'date' : Date,
	'userID': String,
	'username': String
});

module.exports = mongoose.model('question', questionSchema);
