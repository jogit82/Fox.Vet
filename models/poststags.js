'use strict';
module.exports = function(sequelize, DataTypes) {
  var poststags = sequelize.define('poststags', {
    postId: DataTypes.INTEGER,
    tagId: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return poststags;
};