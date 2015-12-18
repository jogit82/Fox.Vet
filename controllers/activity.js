var express = require('express');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, res) {
	if(req.user) {
	    res.render('activities/');
	} else {
	    res.redirect('/');
	}
});

module.exports = router;
