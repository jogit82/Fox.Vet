var express = require('express');
var db = require('../models');
var router = express.Router();

router.get('/', function(req, res) {
  if(req.user) {
    db.post.findAll({
      where: {
        userId: req.session.passport.user
      },
      order: [['createdAt', 'DESC']]
    }).then(function(posts){
      res.render('profile', {posts: posts});
   });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
