var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var answerSchema = new Schema({
	'content' : String,
	'accepted' : Boolean,
	'userID' : String,
	'questionID' : String,
	'date' : Date
});

module.exports = mongoose.model('answer', answerSchema);
