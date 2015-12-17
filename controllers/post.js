var express    = require('express');
var db         = require('../models');
var multer     = require('multer');
var cloudinary = require('cloudinary');
var upload     = multer({ dest: './uploads/' });
var router     = express.Router();

router.get('/', function(req, res) {
  res.render('posts/');
});

router.get('/all', function(req, res) {
  db.post.findAll({
    order: 'id DESC'
  }).then(function(posts) {
    res.render('posts/allposts', {posts: posts});
  });
});

router.get('/:id/tags', function(req, res) {
  var favoriteId = req.params.id;
  db.favorite.findById(favoriteId).then(function(favorite) {
    favorite.getTags().then(function(tags) {
      res.render('favorites/tags', {tags: tags, favorite: favorite});
    });
  });
});

router.post('/', upload.single('myFile'), function(req, res){
  cloudinary.uploader.upload(req.file.path, function(result) {
    var newPost = {
      caption:req.body.caption,
      description:req.body.description,
      image : result.url
    }
    db.post.create(newPost).then(function(posted){
      var comma = ',';
      var tags = req.body.tagName;
      var separatedTags = tags.split(/[\s,]+/);
      for (var i = 0; i < separatedTags.length; i++) {
        db.tag.findOrCreate({where: {tag: separatedTags[i]}}).spread(function(tag, created){
          posted.addTag(tag).then(function(){
            res.redirect('/posts');
          });
        });
      }
    });
  });
});

// router.post('/:id/comments', function(req, res) {
//   var id = req.params.id;
//   db.favorite.findById(id).then(function(favorite) {
//     favorite.createComment({
//       text: req.body.text,
//       author: req.body.author
//     }).then(function(comment) {
//       res.redirect('/favorites/' + id + '/comments');
//     });
//   });
// });



// router.post('/', function(req, res) {
//   db.post.findOrCreate({
//     where: {
//       id: req.body.postID
//     },
//     defaults: {
//       year: req.body.year,
//       title: req.body.title
//     }
//   }).spread(function(favorite, created) {
//     console.log(favorite.get());
//     res.redirect('/');
//   });
// });

// router.get('/', function(req, res) {
//   db.favorite.findAll({
//     order: 'title ASC'
//   }).then(function(favorites) {
//     res.render('favorites/index', {favorites: favorites});
//   });
// });

// router.delete('/:imdbID', function(req, res) {
//   db.favorite.destroy({
//     where: {
//       imdbID: req.params.imdbID
//     }
//   }).then(function() {
//     res.send({'msg': 'success'});
//   }).catch(function(e) {
//     res.send({'msg': 'error', 'error': e});
//   });
// });

// router.get('/:id/comments', function(req, res) {
//   var id = req.params.id;
//   db.favorite.findById(id).then(function(favorite) {
//     favorite.getComments().then(function(comments) {
//       res.render('favorites/comments', {comments: comments, favorite: favorite});
//     });
//   });
// });

// router.post('/:id/comments', function(req, res) {
//   var id = req.params.id;
//   db.favorite.findById(id).then(function(favorite) {
//     favorite.createComment({
//       text: req.body.text,
//       author: req.body.author
//     }).then(function(comment) {
//       res.redirect('/favorites/' + id + '/comments');
//     });
//   });
// });


module.exports = router;



