// src/database/models/autoResponse.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const AutoResponse = sequelize.define('AutoResponse', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  trigger: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  response: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // Add more fields as needed
});

module.exports = AutoResponse;
