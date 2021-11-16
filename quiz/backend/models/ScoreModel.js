var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var ScoreSchema = new Schema({
	'rank' : Number,
	'time' : Number,
	'points' : Number,
	'category': String,
	'userID' : String,
	'date': Date
});

var Score = mongoose.model('Score', ScoreSchema);
module.exports = Score;
