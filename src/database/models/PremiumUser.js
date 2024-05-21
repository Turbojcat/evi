module.exports = (sequelize, DataTypes) => {
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