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

// router.get('/', function(req, res) {
//   db.tag.findAll({
//     include: [db.post]
//   }).then(function(tags) {
//     res.render('posts/allposts', {tags: tags});
//   });
// });

router.get('/all', function(req, res) {
  if(req.user) {
    db.post.findAll({
      order: 'id DESC'
    }).then(function(posts) {
      res.render('posts/allposts', {posts: posts});
    });
  } else {
    res.redirect('/');
  }
});

router.get('/myPosts', function(req, res) {
  if(req.user) {
    db.post.findAll({
      where: {
        userId: req.session.passport.user
      },
      order: [['createdAt', 'DESC']]
    }).then(function(posts){
      res.render('posts/myposts', {posts: posts});
   });
  } else {
    res.redirect('/');
  }
});


// router.get('/all', function(req, res) {
//   db.post.findAll({
//     order: 'id DESC'
//   }).then(function(posts) {
//     post.getTags().then(function(tags) {
//       console.log(tags);
//       res.render('posts/allposts', {tags: tags, posts: posts});
//     });
//   });
// });

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

router.get('/search', function(req, res){
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

router.get('/:term', function(req, res){
  var searchTerm = req.params.term;
  var foundPosts = [];
  
  db.tag.find(
    {where: {tag: searchTerm}}
  ).then(function(tag) {
    tag.getPosts().then(function(posts){
      posts.forEach(function(post){
        foundPosts.push(post);
      });
      res.send(foundPosts);
    });
  });
});


// router.get('/', function(req, res){
//   var foundPosts = [];
  
//   db.tag.find(
//     {where: {tag: "dog"}}
//   ).then(function(tag) {
//     tag.getPosts().then(function(posts){
//       posts.forEach(function(post){
//         foundPosts.push(post);
//       });
//       res.send(foundPosts);
//     });
//   });
// });

// module.exports = router;

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



