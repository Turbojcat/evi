// database/models/TicketCategory.js

module.exports = (sequelize, DataTypes) => {
  const TicketCategory = sequelize.define('TicketCategory', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    categoryId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  });

  return TicketCategory;
};