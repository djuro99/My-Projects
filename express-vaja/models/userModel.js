var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var Schema   = mongoose.Schema;

var userSchema = new Schema({
	'username' : String,
	'email' : String,
	'password' : String,
	'path': String
});

userSchema.statics.authenticate = function(username, password, callback) {
	User.findOne({username : username})
	.exec(function (err, user) {
		if (err) {
			return callback(err);
		} else if (!user) {
			var err = new Error('User not found.');
			err.status = 401;
			return callback(err);
		}
		bcrypt.compare(password, user.password, function (err, result) {
			if (result == true) {
				return callback(null, user);
			} else {
				console.log("napačno geslo!")
				return callback();
			}
		})
	});
}

userSchema.pre('save', function (next) {
	var user = this;
	if (user.path == "N/A") {
		bcrypt.hash(user.password, 10, function (err, hash) {
			if (err) {
				return next(err);
			}
			user.password = hash;
			next();
		})
	}
	else
		next();
});

var User = mongoose.model('User', userSchema);
module.exports = User;
