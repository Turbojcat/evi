const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ModAction = sequelize.define('ModAction', {
    guildId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    moderatorId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    targetId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reason: {
      type: DataTypes.STRING,
    },
  });

  return ModAction;
};
