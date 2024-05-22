// src/database/models/CustomPlaceholder.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
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
    premium: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    // Add more fields as needed
  });

  return CustomPlaceholder;
};
