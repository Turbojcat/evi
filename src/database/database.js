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
  sequelize,
  ...models,
};
