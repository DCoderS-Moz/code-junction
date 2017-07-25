var express = require('express');
var router = express.Router();
var fs = require('fs');
var mkdirp = require('mkdirp');
var rmdir = require('rmdir');
var Event = require('../models/event.js');

// Check if user is admin
function isAdmin(req, res, next){
	if(req.user && req.user.username == 'admin'){
		return next();
	} else {
		res.redirect('/');
	}
}

router.get('/', isAdmin, function(req,res){
	console.log(req.user);
	res.render('admin_dashboard', {
		'title': 'Dashboard',
		'subtitle': 'Welcome to admin dashboard'
	});
});

router.post('/event/add', isAdmin, function(req,res){

	// Get form values
	var name = req.body.name;
	var language = req.body.language;
	var duration = req.body.duration;
	var number_of_questions = req.body.number_of_questions;
	
	// Form validation
	req.checkBody('name', 'Name is required').notEmpty(name);
	req.checkBody('language', 'Language is required').notEmpty(language);
	req.checkBody('duration', 'Duration is required').notEmpty(duration);
	req.checkBody('duration', 'Duration must be an integer').isInt(duration);
	req.checkBody('number_of_questions', 'Number of questions is required').notEmpty(number_of_questions);
	req.checkBody('number_of_questions', 'Number of questions must be an integer').isInt(number_of_questions);

	// Check for validation errors
	var errors = req.validationErrors();

	if(errors){
		console.log(errors);
		res.render('admin_dashboard', {
			errors : errors
		});
	} else {

		// Prepare new event object
		var newEvent = new Event({
			'name': name,
			'language': language,
			'duration': duration,
			'number_of_questions': number_of_questions,
			'status': 'inactive'
		});

		// Create event
		Event.createEvent(newEvent, function(err, resp){
			if(err) throw err;
			console.log(resp);
			
			// Create directories
			mkdirp('./events/' + resp._id +  '/questions', function (err) {
			    if (err) console.error(err)
			    //Create questionfiles
				var i=1;
				function createFile(i){
					if(i <= number_of_questions){
						var createStream = fs.createWriteStream('./events/' + resp._id +  '/questions/' + i);
						createStream.end();
						createFile(++i);
					}
				}
				createFile(i);
			});

			mkdirp('./events/' + resp._id + '/answers', function (err) {
			    if (err) console.error(err)
			    	//Create answer files
					var i=1;
					function createFile(i){
					if(i <= number_of_questions){
						var createStream = fs.createWriteStream('./events/' + resp._id +  '/answers/' + i);
						createStream.end();
						createFile(++i);
					}
				}
				createFile(i);
			});

			mkdirp('./events/' + resp._id + '/submissions', function (err) {
			    if (err) console.error(err)
			});

			// Success message
			req.flash('success', 'Event has been created.');
			res.location('/admin');
			res.redirect('/admin');
		});
	}

});

// Get event/s
router.get('/event/get/:id', isAdmin, function(req,res){
	Event.getEvents(req.params.id,function(events){
		res.json(events);
	});
});


// Start event
router.post('/event/start', isAdmin, function(req,res){
	Event.startEvent(req.body.id, function(event){
		console.log('Event inactive');
		res.send('success');
	});
});

// Stop event
router.post('/event/stop', isAdmin, function(req,res){
	Event.stopEvent(req.body.id, function(event){
		console.log('Event active');
		res.send('success');
	});
});

// Edit event
router.get('/event/edit/:id', isAdmin, function(req, res){
	res.render('admin_edit', {
		'title': 'Edit event',
		'subtitle': 'Start editing below',
		'id': req.params.id
	});
});

// Delete event
router.post('/event/delete', isAdmin, function(req,res){
	Event.deleteEvent(req.body.id, function(event){
		console.log('Event deleted');
		rmdir('./events/' + req.body.id, function(err, msg){
			if(err) throw err;
			else {
				res.send('success');
			}
		}); 
	});
});

// Get question
router.get('/event/question/:id/:number', isAdmin, function(req,res){
	var question_number = req.params.number;
	var id = req.params.id;
	fs.readFile('./events/' + id + '/questions/' + question_number, 'utf8', function (err,data) {
		if(err) throw err;
		res.json(data);
	});
});

// Get answer
router.get('/event/answer/:id/:number', isAdmin, function(req,res){
	var answer_number = req.params.number;
	var id = req.params.id;
	fs.readFile('./events/' + id + '/answers/' + answer_number, 'utf8', function (err,data) {
		if(err) throw err;
		res.json(data);
	});
});

// Edit question page
router.get('/event/get/:id/:question_number', isAdmin, function(req,res){
	res.render('admin_edit_question', {
		'title': 'Question Edit',
		'subtitle': 'Question number : ' + req.params.question_number,
		'id': req.params.id,
		'question_number': req.params.question_number
	});
});

// Save changes from question page
router.post('/event/update/:id/:question_number', isAdmin, function(req,res){
	fs.writeFile('./events/' + req.params.id + '/questions/' + req.params.question_number, req.body.question, 'utf8', function (err,data) {
		if(err) throw err;
	});
	fs.writeFile('./events/' + req.params.id + '/answers/' + req.params.question_number, req.body.answer, 'utf8', function (err,data) {
		if(err) throw err;
	});
	console.log(req.body.question);
	console.log(req.body.answer);
	res.send('Changes saved successfully!');
});

// Save changes from question page
router.post('/event/update', isAdmin, function(req,res){
	Event.updateEvent(req.body.id, req.body.name, req.body.language, req.body.duration, function(event){
		console.log(event);
		console.log('Event updated');
	});
	res.send('success');
});

module.exports = router;