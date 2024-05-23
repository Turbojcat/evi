const { sequelize, DataTypes } = require('./database');

module.exports = (sequelize, DataTypes) => {
    const Warnings = sequelize.define('Warnings', {
      userId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      guildId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    });
  
    return Warnings;
  };
  