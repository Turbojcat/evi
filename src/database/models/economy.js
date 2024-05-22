// src/database/models/economy.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../connection');

const Economy = sequelize.define('Economy', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  balance: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  },
  // Add more fields as needed
});

module.exports = Economy;
