var db = require('./models');

db.favorite.findOne().then(function(favorite) {
  favorite.createComment({
    author: 'Brian',
    text: 'This movie is cool. 10/10 would watch again'
  }).then(function(comment) {
    console.log(comment.get());
  })
});