var express = require('express');
var router = express.Router();

// Members page
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', { 
  	title: 'Dashboard' ,
  	subtitle: 'Welcome to your D\'Coders Code Junction'
  });
});

function ensureAuthenticated(req,res,next){
	if(req.isAuthenticated()){
		return next();
	} else{
		res.redirect('/users/login');
	}
}

module.exports = router;
