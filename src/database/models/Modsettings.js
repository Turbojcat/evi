module.exports = (sequelize, DataTypes) => {
    const ModSettings = sequelize.define('ModSettings', {
      guildId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      forbiddenWords: {
        type: DataTypes.JSON,
        defaultValue: [],
      },
      streakThreshold: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
      },
      streakAction: {
        type: DataTypes.STRING,
        defaultValue: 'ban',
      },
    });
  
    return ModSettings;
  };
  