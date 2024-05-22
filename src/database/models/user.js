// src/database/models/User.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    discordId: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    wallet: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    bank: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    dailyStreak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastDailyTimestamp: {
      type: DataTypes.DATE,
    },
    weeklyStreak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastWeeklyTimestamp: {
      type: DataTypes.DATE,
    },
    monthlyStreak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastMonthlyTimestamp: {
      type: DataTypes.DATE,
    },
    workStreak: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastWorkTimestamp: {
      type: DataTypes.DATE,
    },
    inventory: {
      type: DataTypes.JSON,
      defaultValue: {},
    },
    fishingRod: {
      type: DataTypes.STRING,
    },
    fishingBait: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    lastFishingTimestamp: {
      type: DataTypes.DATE,
    },
    miningPick: {
      type: DataTypes.STRING,
    },
    lastMiningTimestamp: {
      type: DataTypes.DATE,
    },
    woodcuttingAxe: {
      type: DataTypes.STRING,
    },
    lastWoodcuttingTimestamp: {
      type: DataTypes.DATE,
    },
  });

  return User;
};