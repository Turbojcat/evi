module.exports = (sequelize, DataTypes) => {
    const ModAlertChannel = sequelize.define('ModAlertChannel', {
      guildId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      channelId: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    });
  
    return ModAlertChannel;
  };
  