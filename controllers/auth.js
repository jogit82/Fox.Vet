var db       = require('../models');
var express  = require('express');
var passport = require('passport');
var router   = express.Router();

router.route('/signup')
  .get(function(req, res) {
    res.render('auth/signup');
  })
  .post(function(req, res) {
  if (req.body.password != req.body.password2) {
    req.flash('danger', 'Password must match!');
    res.redirect('/auth/signup');
  } else {
    db.user.findOrCreate({
      where: {
        email: req.body.email
      },
      defaults: {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
      }
    }).spread(function(user, created) {
      if (created) {
        req.login(user, function(err){
          if(err) throw err;
          req.flash('success', 'You are signed up and logged in.')
          res.redirect('/auth/login');
        });
      } else {
        req.flash('danger', 'That email is aready signed up!');
        res.redirect('/auth/signup');
      }
    }).catch(function(err) {
      if (err.message) {
        // TODO error reporting
      } else {
        console.log(err);
      }
      req.flash('danger', 'Error');
      res.redirect('/auth/signup');
    });
  }
});

router.route('/login')
  .get(function(req, res) {
    res.render('auth/login');
  })
  .post(function(req, res){
  passport.authenticate('local', function(err, user, info){
    if(user){
      
      req.login(user, function(err){
        if(err) throw err;
        req.flash('success', 'You are now logged in.');
        // res.send(user.email);
        res.redirect('/posts/all'); // Where to send users after successful login
      });
    } else {
      req.flash('danger', 'Error');
      res.redirect('/auth/login');
    }
  })(req, res);
});

router.get('/login/:provider', function(req, res){
  switch(req.params.provider){
    case 'facebook':
      passport.authenticate(
        req.params.provider,
        {scope: ['public_profile', 'email', 'user_friends']}
      )(req, res);
  }
});

router.get('/callback/:provider', function(req, res){
  var provider = req.params.provider;
  passport.authenticate(req.params.provider, function(err, user, info){
    if(err) throw err;
    if(user){
      req.login(user, function(err){
        if(err) throw err;
        req.flash('success', 'You are now logged in with ' + provider.charAt(0).toUpperCase() + provider.slice(1));
        res.redirect('/');
      });
    } else {
      req.flash('danger', 'Error');
      res.redirect('/auth/login');
    }
  })(req, res);
});

// Normal, non passport/passport-local login
// router.post('/login', function(req, res) {
//   db.user.authenticate(req.body.email, req.body.password, function(err, user) {
//     if (err) { // if callback passes an error message
//       res.send(err);
//     } else if (user) { // if callback passes a user object
//       req.session.user = user.id;
//       res.redirect('/');
//     } else { // if callback passes a false
//       // Invalid username or password error TODO
//       res.redirect('/auth/login');
//     }
//   });
// });

router.get('/logout', function(req, res) {
  // req.session.user = false;
  req.logout(); // passport function
  req.flash('info', 'You have been logged out.');
  res.redirect('/');
});

module.exports = router;