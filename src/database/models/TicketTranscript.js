// src/database/models/TicketTranscript.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TicketTranscript = sequelize.define('TicketTranscript', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    transcript: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Add more fields as needed
  });

  return TicketTranscript;
};
