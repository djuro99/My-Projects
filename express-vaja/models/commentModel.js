var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var commentSchema = new Schema({
	'commentContent' : String,
	'userID' : String,
	'foreignID' : String,
	'date': Date
});

module.exports = mongoose.model('comment', commentSchema);
