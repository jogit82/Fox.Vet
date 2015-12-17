var bcrypt = require('bcrypt');
var password = 'trex';
var encryptedPassword;
bcrypt.hash(password, 10, function(err, hash){
	console.log(hash);
}); // # of rounds of encryption, more rounds more secured