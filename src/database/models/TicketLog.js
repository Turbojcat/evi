// src/database/models/TicketLog.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TicketLog = sequelize.define('TicketLog', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Add more fields as needed
  });

  return TicketLog;
};
