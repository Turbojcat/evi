// src/database/models/TicketResponse.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TicketResponse = sequelize.define('TicketResponse', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    ticketId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    response: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Add more fields as needed
  });

  return TicketResponse;
};
