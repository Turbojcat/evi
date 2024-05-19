const mongoose = require('mongoose');
const config = require('../config');

async function connectToDatabase() {
  try {
    await mongoose.connect(config.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the database');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
}

module.exports = connectToDatabase;
