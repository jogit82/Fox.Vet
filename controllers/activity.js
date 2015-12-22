var express    = require('express');
var db         = require('../models');
var router     = express.Router();

router.get('/', function(req, res) {
	if(req.user) {
    db.activity.findAll({
    	where : {
    		toUser: ''+req.session.passport.user
    	},
      order: [['createdAt', 'DESC']]
    }).then(function(activities) {
    	console.log("moo");
      res.render('activities', {activities: activities});
    });
  } else {
    res.redirect('/');
  }
});

module.exports = router;
