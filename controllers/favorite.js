var express = require('express');
var db = require('./../models');
var router = express.Router();

router.post('/', function(req, res) {
  db.favorite.findOrCreate({
    where: {
      imdbID: req.body.imdbID
    },
    defaults: {
      year: req.body.year,
      title: req.body.title
    }
  }).spread(function(favorite, created) {
    console.log(favorite.get());
    res.redirect('/');
  });
});

router.get('/', function(req, res) {
  db.favorite.findAll({
    order: 'title ASC'
  }).then(function(favorites) {
    res.render('favorites/index', {favorites: favorites});
  });
});

router.delete('/:imdbID', function(req, res) {
  db.favorite.destroy({
    where: {
      imdbID: req.params.imdbID
    }
  }).then(function() {
    res.send({'msg': 'success'});
  }).catch(function(e) {
    res.send({'msg': 'error', 'error': e});
  });
});

router.get('/:id/comments', function(req, res) {
  var id = req.params.id;
  db.favorite.findById(id).then(function(favorite) {
    favorite.getComments().then(function(comments) {
      res.render('favorites/comments', {comments: comments, favorite: favorite});
    });
  });
});

router.post('/:id/comments', function(req, res) {
  var id = req.params.id;
  db.favorite.findById(id).then(function(favorite) {
    favorite.createComment({
      text: req.body.text,
      author: req.body.author
    }).then(function(comment) {
      res.redirect('/favorites/' + id + '/comments');
    });
  });
});

router.get('/:id/tags/new', function(req, res) {
  res.render('tags/new', {favoriteId: req.params.id});
});

router.post('/:id/tags', function(req, res) {
  // res.send(req.body);
  db.favorite.findById(parseInt(req.params.id)).then(function(favorite) {
    // res.send(favorite.get());
    db.tag.findOrCreate({
      where: {name: req.body.tagName}
    }).spread(function(tag, created) {
      // res.send(tag.get());
      favorite.addTag(tag).then(function() {
        res.redirect('/favorites');
      });
    });
  });
});


module.exports = router;