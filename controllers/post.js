var express    = require('express');
var db         = require('../models');
var multer     = require('multer');
var cloudinary = require('cloudinary');
var upload     = multer({ dest: './uploads/' });
var router     = express.Router();

router.get('/', function(req, res) {
  if(req.user) {
    res.render('posts/');
  } else {
    res.redirect('/');
  }
});

router.get('/all', function(req, res) {
  if(req.user) {
    db.post.findAll({
      order: [['createdAt', 'DESC']], include:[db.user]
    }).then(function(posts) {
      // res.send(posts)
      res.render('posts/allposts', {posts: posts});
    });
  } else {
    res.redirect('/');
  }
});

router.post('/', upload.single('myFile'), function(req, res){
  cloudinary.uploader.upload(req.file.path, function(result) {
    var newPost = {
      caption:req.body.caption,
      description:req.body.description,
      image : result.url,
      userId: req.session.passport.user
    }
    db.post.create(newPost).then(function(posted){
      var comma = ',';
      var tags = req.body.tagName;
      var separatedTags = tags.split(/[\s,]+/);
      for (var i = 0; i < separatedTags.length; i++) {
        db.tag.findOrCreate({where: {tag: separatedTags[i]}}).spread(function(tag, created){
          posted.addTag(tag).then(function(){
            res.redirect('/posts/all');
          });
        });
      }
    });
  });
});
router.get('/:id/api', function(req, res) {
  var id = req.params.id;
  // db.activity.create({ content: 'second comment', fromUser: 4, toUser: 5, type: 'likes', postId: 37 }).then(function(activity) {
  db.activity.findAll({where: {type: 'comment', postId: id}})
  .then(function(activities){
    db.user.findAll().then(function(users){
      console.log(activities)

      var acts = [activities];
      users.forEach(function(user){
        activities.forEach(function(act){
          if(parseInt(act.fromUser) == user.id){
            acts.push(user);
          } 
        })
      })
    res.send({activities: acts});

    })
  });
});
router.get('/:id/comments', function(req, res) {
  var id = req.params.id;
  // db.activity.create({ content: 'second comment', fromUser: 4, toUser: 5, type: 'likes', postId: 37 }).then(function(activity) {
  db.activity.findAll({where: {type: 'comment', postId: id}})
  .then(function(activities){
    db.user.findAll().then(function(users){
      console.log(activities)

      var acts = [activities];
      users.forEach(function(user){
        activities.forEach(function(act){
          if(parseInt(act.fromUser) == user.id){
            acts.push(user);
          } 
        })
      })
    res.render('posts/comments', {activities: acts});

    })
  });
});

router.post('/:id/comments', function(req, res) {
  var id = req.params.id;
  db.post.findById(id).then(function(post){
    post.createActivity({
      content: req.body.comment,
      type: 'comment',
      fromUser: req.session.passport.user,
      toUser: post.userId
    }).then(function(activity){
      res.redirect('/posts/' + id + '/comments');
    });
  });
});

module.exports = router;



