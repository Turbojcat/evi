// src/database/models/TicketQuestion.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TicketQuestion = sequelize.define('TicketQuestion', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Add more fields as needed
  });

  return TicketQuestion;
};
