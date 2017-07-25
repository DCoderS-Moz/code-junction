var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/nodeauth', { useMongoClient: true });

var db = mongoose.connection;

// Event schema
var eventSchema = mongoose.Schema({
	name: {
		type: String,
		index: true,
		required: true
	},
	language: {
		type: String, 
		required: true
	},
	duration: {
		type: Number,
		required: true
	},
	number_of_questions: {
		type: Number,
		required: true
	},
	status: {
		type: String
	},
	date: {
		type: Date, 
		default: Date.now 
	}
});

var Event = module.exports = mongoose.model('Event', eventSchema, 'events');

module.exports.createEvent = function(newEvent, callback){
	// Create event
	newEvent.save(callback);
}

module.exports.getEvents = function(id, callback){
	if(id == 'all'){
		// Get all event
		Event.find({}, function(err, events){
			if(err){
				throw err;
			} else {
				callback(events);
			}
		});
	} else {
		// Get event by id
		Event.findById(id, function(err, events){
			if(err){
				throw err;
			} else {
				callback(events);
			}
		});
	}
}

module.exports.startEvent = function(id, callback){
	//Find and update status by id
	Event.update({ _id: id }, { $set: { status: 'active' }}, callback);
}

module.exports.stopEvent = function(id, callback){
	//Find and update status by id
	Event.update({ _id: id }, { $set: { status: 'inactive' }}, callback);
}

module.exports.deleteEvent = function(id, callback){
	//Find and update status by id
	Event.findByIdAndRemove({ _id: id }, callback);
}

module.exports.updateEvent = function(id, name, language, duration, callback){
	//Find and update status by id
	Event.update({ _id: id }, { $set: { name: name, language: language, duration: duration}}, callback);
}

/*module.exports.getUserByUsername = function(username, callback){
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
}*/
