const { Sequelize } = require('sequelize');
const mysql = require('mysql2/promise');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('../config');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
});

const models = {
  Ticket: require('./models/Ticket')(sequelize),
  TicketQuestion: require('./models/TicketQuestion')(sequelize),
  TicketResponse: require('./models/TicketResponse')(sequelize),
  TicketStaffRole: require('./models/TicketStaffRole')(sequelize),
  TicketLog: require('./models/TicketLog')(sequelize),
  TicketTranscript: require('./models/TicketTranscript')(sequelize),
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

async function connectDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to the MySQL database');
    return sequelize;
  } catch (error) {
    console.error('Error connecting to the MySQL database:', error);
    process.exit(1);
  }
}

async function syncDatabase() {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error);
  }
}

module.exports = {
  connectDatabase,
  syncDatabase,
  sequelize,
  ...models,
};