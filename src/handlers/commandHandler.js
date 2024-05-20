const { Sequelize } = require('sequelize');

async function connectDatabase(config) {
  const sequelize = new Sequelize(config.database, config.username, config.password, {
    host: config.host,
    port: config.port,
    dialect: 'mysql',
    logging: false,
  });

  try {
    await sequelize.authenticate();
    console.log('Connected to the database');
    return sequelize;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
}

module.exports = {
  connectDatabase,
};