// src/database/models/PremiumUser.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PremiumUser = sequelize.define('PremiumUser', {
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    expiresAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  return PremiumUser;
};