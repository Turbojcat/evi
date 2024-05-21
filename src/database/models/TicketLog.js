const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TicketLog = sequelize.define('TicketLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    guildId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return TicketLog;
};