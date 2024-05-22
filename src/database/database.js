// src/database/connection.js
const { Sequelize, DataTypes } = require('sequelize');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('../config');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  logging: false,
});

const models = {
  User: require('./models/User')(sequelize),
  Ticket: require('./models/Ticket')(sequelize),
  TicketQuestion: require('./models/TicketQuestion')(sequelize),
  TicketResponse: require('./models/TicketResponse')(sequelize),
  TicketStaffRole: require('./models/TicketStaffRole')(sequelize),
  TicketLog: require('./models/TicketLog')(sequelize),
  TicketTranscript: require('./models/TicketTranscript')(sequelize),
  TicketCategory: require('./models/TicketCategory')(sequelize, DataTypes),
  PremiumUser: require('./models/PremiumUser')(sequelize),
  ModLogChannel: require('./models/ModLogChannel')(sequelize, DataTypes),
  ModAlertChannel: require('./models/ModAlertChannel')(sequelize, DataTypes),
  // Add more models as needed
};

// Define associations between models
models.Ticket.hasMany(models.TicketResponse);
models.TicketResponse.belongsTo(models.Ticket);
models.TicketQuestion.hasMany(models.TicketResponse);
models.TicketResponse.belongsTo(models.TicketQuestion);
models.Ticket.hasMany(models.TicketLog);
models.TicketLog.belongsTo(models.Ticket);
models.Ticket.hasOne(models.TicketTranscript);
models.TicketTranscript.belongsTo(models.Ticket);

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to the MySQL database');

    // Sync the models with the database
    await syncModels();
    console.log('Database models synced');

    return sequelize;
  } catch (error) {
    console.error('Error connecting to the MySQL database:', error);
    process.exit(1);
  }
}

async function syncModels() {
  try {
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Error syncing database models:', error);
    throw error;
  }
}

module.exports = {
  connectToDatabase,
  sequelize,
  ...models,
};
