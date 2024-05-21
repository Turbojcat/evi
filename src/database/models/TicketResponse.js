// src/database/models/TicketResponse.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TicketResponse = sequelize.define('TicketResponse', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Add more fields as needed
  });

  return TicketResponse;
};
