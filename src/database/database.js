// src/database/database.js
const { Sequelize, DataTypes } = require('sequelize');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('../config');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  logging: false,
});

const models = {
  User: require('./models/User')(sequelize, DataTypes),
  Ticket: require('./models/Ticket')(sequelize, DataTypes),
  TicketQuestion: require('./models/TicketQuestion')(sequelize, DataTypes),
  TicketResponse: require('./models/TicketResponse')(sequelize, DataTypes),
  TicketStaffRole: require('./models/TicketStaffRole')(sequelize, DataTypes),
  TicketLog: require('./models/TicketLog')(sequelize, DataTypes),
  TicketTranscript: require('./models/TicketTranscript')(sequelize, DataTypes),
  TicketCategory: require('./models/TicketCategory')(sequelize, DataTypes),
  PremiumUser: require('./models/PremiumUser')(sequelize, DataTypes),
  ModLogChannel: require('./models/ModLogChannel')(sequelize, DataTypes),
  ModAlertChannel: require('./models/ModAlertChannel')(sequelize, DataTypes),
  CustomPlaceholder: require('./models/CustomPlaceholder')(sequelize, DataTypes),
};

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to the MySQL database');
    return sequelize;
  } catch (error) {
    console.error('Error connecting to the MySQL database:', error);
    throw error;
  }
}

async function syncDatabase() {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database models synced');
  } catch (error) {
    console.error('Error syncing database models:', error);
    throw error;
  }
}

module.exports = {
  connectToDatabase,
  syncDatabase,
  sequelize,
  ...models,
};
