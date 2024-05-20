// src/database/models/Ticket.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Ticket = sequelize.define('Ticket', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    channelId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    closed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Add more fields as needed
  });

  return Ticket;
};
