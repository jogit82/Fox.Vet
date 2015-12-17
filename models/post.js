'use strict';
module.exports = function(sequelize, DataTypes) {
  var post = sequelize.define('post', {
    caption: DataTypes.TEXT,
    description: DataTypes.TEXT,
    image: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        // models.post.belongsTo(models.user);
        models.post.hasMany(models.activity);
        models.post.belongsToMany(models.tag,{through:"poststags"});
      }
    }
  });
  return post;
};