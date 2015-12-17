'use strict';
module.exports = function(sequelize, DataTypes) {
  var activity = sequelize.define('activity', {
    content: DataTypes.TEXT,
    postId: DataTypes.INTEGER,
    fromUser: DataTypes.STRING,
    toUser: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.activity.belongsTo(models.user);
        models.activity.belongsTo(models.post);
      }
    }
  });
  return activity;
};