var express = require('express');
var db      = require('../models');
var router  = express.Router();

router.get('/', function(req, res){
	var foundPosts = [];
	
	db.tag.find(
		{where: {tag: "dog"}}
	).then(function(tag) {
		tag.getPosts().then(function(posts){
			posts.forEach(function(post){
				foundPosts.push(post);
			});
			res.send(foundPosts);
		});
	});
});

module.exports = router;