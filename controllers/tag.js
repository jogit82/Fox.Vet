var express = require('express');
var db      = require('../models');
var router  = express.Router();

router.post('/', function(req, res){
	db.tag.find({
		where: {
			tag: req.body.term
		}
	}).then(function(tag) {
		tag.getPosts().then(function(posts){
			res.render('posts/search', {posts: posts});
		});
	});
});

module.exports = router;