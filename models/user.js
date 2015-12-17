'use strict';
var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING
  }, {
    classMethods: { //whatever you put here, you can call it later
      associate: function(models) {
        // associations can be defined here
      },
      authenticate: function(email, password, callback) {
        this.find({where: {email: email}}).then(function(user) {
          if (user) {
            bcrypt.compare(password, user.password, function(err, result) {
              if (err) {
                callback(err);
              } else {
                // if (result) {
                //   callback(null, user);
                // } else {
                //   callback(null, false);
                // } 
                //shorthand: 
                callback(null, result ? user : false);
              }
            });
          }
        });
      }
    },
    hooks: {
      beforeCreate: function(user, options, callback) {
        if (user.password) {
          bcrypt.hash(user.password, 10, function(err, hash) {
            if (err) {
              return callback(err);
            }
            user.password = hash;
            callback(null, user);
          });
        } else {
          //TODO error reporting
          callback(null, user);
        }
      }
    }
  });
  return user;
};