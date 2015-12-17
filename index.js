var express    = require('express');
var session    = require('express-session');
var ejsLayouts = require('express-ejs-layouts');
var request    = require('request');
var bodyParser = require('body-parser');
var bcrypt     = require('bcrypt');
var db         = require('./models');
var strategies = require('./config/strategies');
var passport   = require('passport');
var flash      = require('connect-flash');

var app = express();

app.set('view engine', 'ejs');
app.use(ejsLayouts);
app.use(express.static(__dirname + '/static'));
app.use(bodyParser.urlencoded({extended: false}));
app.use(flash());

app.use(session({
	secret: 'I love my cat',
	resave: false,
	saveUninitialized: true
}));

// Passort Login Code for local and Facebook
app.use(passport.initialize());
app.use(passport.session());

passport.use(strategies.localStrategy);
passport.use(strategies.facebookStrategy);

passport.serializeUser(strategies.serializeUser);
passport.deserializeUser(strategies.deserializeUser);

// First middleware - Not needed when using passport and passport-local
// app.use(function(req, res, next) {
// 	if (req.session.user) {
// 		db.user.findById(req.session.user).then(function(user){
// 			req.currentUser = user;
// 			next();
// 		});
// 	} else {
// 		req.currentUser = false;
// 		next();
// 	}
// });

// Second middleware
app.use(function(req, res, next) {
	res.locals.currentUser = req.user; // req.user is added by passport automatically.
	// res.locals.currentUser = req.currentUser;//set response.locals to currentUser so we can use the currentUser object (email, name, password)in our template
	// TODO pass alerts
	res.locals.alerts = req.flash(); // return an array of all of our alerts
	next();
});

app.use(function(req, res, next) {

	// req.toLowerCase = function(string) {
	// 	return string.toLowerCase();
	// }
	req.session.lastPage = req.header('Referer'); 
	res.locals.lastPage = req.session.lastPage;
	next();
});

app.get('/', function(req, res) {
  res.render('index');
});

app.use('/posts', require('./controllers/post'));
app.use('/friends', require('./controllers/friend'));
app.use('/profile', require('./controllers/profile'));
app.use('/activities', require('./controllers/activity'));
app.use('/movies', require('./controllers/movie'));
app.use('/favorites', require('./controllers/favorite'));
app.use('/auth', require('./controllers/auth'));
app.use('/test', require('./controllers/test'));


var port = 3000;
app.listen(port, function() {
  console.log("You're listening to the smooth sounds of port " + port);
});