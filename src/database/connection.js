// src/database/connection.js
const Sequelize = require('sequelize');
const { ModAction } = require('./database');
const config = require('../config');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME, DB_PORT } = require('../config');
const { TicketLog } = require('./models/TicketLog');


async function connectDatabase() {
  const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    logging: false, // Set to false to disable SQL query logging
  });

  try {
    await sequelize.authenticate();
    console.log('Connected to the database');

    // Sync the models with the database
    await syncDatabase(sequelize);

    return sequelize;
  } catch (error) {
    console.error('Error connecting to the database:', error);
    process.exit(1);
  }
}

async function syncDatabase(sequelize) {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database models synced');
  } catch (error) {
    console.error('Error syncing database models:', error);
    process.exit(1);
  }
}

module.exports = {
  connectDatabase,
  syncDatabase,
  TicketLog,
};
