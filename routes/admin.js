var express = require('express');
var router = express.Router();
var multer = require("multer");
var upload = multer({ dest: './uploads' });
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;

var User = require('../models/user.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register',function(req, res, next){
	res.render('register',{
		'title': 'Register',
		'subtitle': 'Please register using the form below'
	});
});

router.get('/login',function(req, res, next){
	res.render('login',{
		'title': 'Login',
		'subtitle': 'Please login using the form below'
	});
});

// Handle registeration form
router.post('/register', upload.single('profileimage'), function(req,res,next){
	//Get form values
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password2;
	var year = req.body.year;
	var mobile_number = req.body.mobile_number;

	// Form validation
	req.checkBody('name', 'Name field is required').notEmpty();
	req.checkBody('email', 'Email field is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Registration number field is required').notEmpty();
	req.checkBody('username', 'Registration number field is invalid').isInt();
	req.checkBody('password', 'Password field is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);
	req.checkBody('year', 'College year is required').notEmpty(req.body.year);
	req.checkBody('mobile_number', 'Mobile number is required').notEmpty(req.body.mobile_number);
	req.checkBody('mobile_number', 'Mobile number is invalid').isInt(req.body.mobile_number);

	// Check for errors
	var errors = req.validationErrors();

	if(errors){
		console.log((errors));
		res.render('register', {
			'errors': errors,
			'name': name,
			'email': email,
			'username': username,
			'password': password,
			'password2': password2,
			'year': year,
			'mobile_number': mobile_number
		});
	} else {
		var newUser = new User({
			'name': name,
			'email': email,
			'username': username,
			'password': password,
			'year': year,
			'mobile_number': mobile_number
		});

		// Create user
		User.createUser(newUser, function(err, resp){
			if(err) throw err;
			if(resp == 'duplicate'){
				console.log('User already exists');
				res.render('register', {
					errors: [{param:'failure', msg: 'User already exists'}]
				});

			} else {
				console.log(resp);
				// Success message
				req.flash('success', 'You are now registered and may login.');

				res.location('/');
				res.redirect('/');
			}
		});

		/*// Success message
		req.flash('success', 'You are now registered and may login.');

		res.location('/');
		res.redirect('/');*/
	}
});

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
        done(err, user);
    });
});


passport.use('local', new LocalStrategy(
	function(username, password, done){
		User.getUserByUsername(username, function(err,user){
			if(err) throw err;
			if(!user){
				console.log('Unknown user');
				return done(null, false, {message: 'Unknown user'});
			}

			User.comparePassword(password,user.password, function(err, isMatch){
				if(err) throw err;
				if(isMatch){
					return done(null,user);
				} else {
					console.log('Invalid password');
					return done(null, false, {message:'Invalid password'});
				}
			});
		});
	}
));


// Handle login form
router.post('/login', passport.authenticate('local', {failureRedirect: '/users/login', failureFlash: 'Invalid username or password'}),function(req,res){
	console.log('Authentication successful');
	req.flash('success', 'You are logged in');
	res.redirect('/');
});

router.get('/logout', function(req,res){
	req.logout();
	req.flash('success', 'You have been logged out');
	res.redirect('/users/login');
});

router.get('	');


module.exports = router;
