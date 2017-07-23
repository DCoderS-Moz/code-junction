var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

mongoose.connect('mongodb://localhost/nodeauth', { useMongoClient: true });

var db = mongoose.connection;

// User schema
var UserSchema = mongoose.Schema({
	username: {
		type: String,
		index: true,
		unique: true
	},
	password: {
		type: String, 
		required: true,
		bcrypt:true
	},
	email: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true
	},
	year: {
		type: Number,
		required: true
	},
	score: {
		type: Array
	},
	reg_data: {
		type: Date,
		default: Date.now
	},
	mobile_number: {
		type: Number,
		unique : true,
		required: true
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserByUsername = function(username, callback){
	var query = {username: username};
	User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch){
		if(err) return callback(err);
		callback(null, isMatch);

	}); 
}

module.exports.createUser = function(newUser, callback){
	bcrypt.hash(newUser.password, 10, function(err, hash){
		if(err) throw err;
		// Set hash pw
		newUser.password = hash;

		//Check for duplicate user
		var query = {username: newUser.username};
		User.findOne(query, function(err2,match){
			if(match){
				callback(err2,'duplicate');
			} else {
				// Create user
				newUser.save(callback);
			}
		});
	});
}