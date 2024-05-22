module.exports = (sequelize, DataTypes) => {
    const ModLogChannel = sequelize.define('ModLogChannel', {
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
  
    return ModLogChannel;
  };
  