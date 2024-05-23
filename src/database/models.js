const { connectDatabase } = require('./database');
const Warnings = require('./Warnings')(sequelize, DataTypes);
const ModSettings = require('./ModSettings')(sequelize, DataTypes);
const { sequelize } = require('./database');
const User = require('./User')(sequelize);
const Ticket = require('./Ticket')(sequelize);
const TicketQuestion = require('./TicketQuestion')(sequelize);
const TicketResponse = require('./TicketResponse')(sequelize);
const TicketStaffRole = require('./TicketStaffRole')(sequelize);
const TicketLog = require('./TicketLog')(sequelize);
const TicketTranscript = require('./TicketTranscript')(sequelize);
const TicketCategory = require('./TicketCategory')(sequelize);
const PremiumUser = require('./PremiumUser')(sequelize);
const ModLogChannel = require('./ModLogChannel')(sequelize);
const ModAlertChannel = require('./ModAlertChannel')(sequelize);
const CustomPlaceholder = require('./CustomPlaceholder')(sequelize);
async function createUserTable() {
  const connection = await connectDatabase();

  try {
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        discordId VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(255) NOT NULL
        -- Add more fields as needed
      )
    `);

    console.log('Users table created or already exists');
  } catch (error) {
    console.error('Error creating users table:', error);
  } finally {
    connection.end();
  }
}

async function createUser(discordId, username) {
  const connection = await connectDatabase();

  try {
    await connection.execute(
      'INSERT INTO users (discordId, username) VALUES (?, ?)',
      [discordId, username]
    );

    console.log('User created successfully');
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    connection.end();
  }
}

async function getUserByDiscordId(discordId) {
  const connection = await connectDatabase();

  try {
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE discordId = ?',
      [discordId]
    );

    return rows[0];
  } catch (error) {
    console.error('Error retrieving user:', error);
    return null;
  } finally {
    connection.end();
  }
}

module.exports = {
  createUserTable,
  createUser,
  getUserByDiscordId,
  User,
  Warnings,
  ModSettings,
  ModAction,
  Ticket,
  TicketQuestion,
  TicketResponse,
  TicketStaffRole,
  TicketLog,
  TicketTranscript,
  TicketCategory,
  PremiumUser,
  ModLogChannel,
  ModAlertChannel,
  CustomPlaceholder,
};
