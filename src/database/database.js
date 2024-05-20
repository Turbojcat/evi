// src/database/database.js
const Sequelize = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(
  config.DATABASE.database,
  config.DATABASE.username,
  config.DATABASE.password,
  {
    host: config.DATABASE.host,
    port: config.DATABASE.port,
    dialect: 'mysql',
  }
);

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log('Databasen er synkronisert');
  } catch (error) {
    console.error('Feil ved synkronisering av databasen:', error);
  }
}

module.exports = {
  sequelize,
  syncDatabase,
};
