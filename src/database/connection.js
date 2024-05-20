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

module.exports = sequelize;
