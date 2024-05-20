// src/database/models/TicketStaffRole.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TicketStaffRole = sequelize.define('TicketStaffRole', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    roleId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Add more fields as needed
  });

  return TicketStaffRole;
};
