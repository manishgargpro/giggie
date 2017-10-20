module.exports = function(sequelize, DataTypes) {
  var Goal = sequelize.define("Goal", {
    text: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      min: 1,
      max: 5,
      defaultValue: 1
    },
    complete: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  });
  Goal.associate = function (db) {
    Goal.belongsTo(db.User, {
      foreignKey: {
        allowNull: false
      }
    })
  };
  return Goal;
};
