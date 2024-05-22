// src/database/models/customPlaceholder.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const CustomPlaceholder = sequelize.define('CustomPlaceholder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  code: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  // Add more fields as needed
});

module.exports = CustomPlaceholder;
