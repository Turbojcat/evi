const mysql = require('mysql2/promise');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('../config');

async function connectDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
    });
    console.log('Connected to the MySQL database');
    return connection;
  } catch (error) {
    console.error('Error connecting to the MySQL database:', error);
    process.exit(1);
  }
}

module.exports = {
  connectDatabase,
};
