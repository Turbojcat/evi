console.log('Importing connectDatabase...');
const { connectDatabase } = require('./database');

console.log('Importing sequelize...');
const { sequelize, DataTypes } = require('./database');

console.log('Importing Warnings...');
const WarningsModule = require('./Warnings');
const Warnings = WarningsModule(sequelize, DataTypes);

console.log('Importing ModSettings...');
const ModSettings = require('./ModSettings')(sequelize, DataTypes);

console.log('Importing User...');
const User = require('./User')(sequelize);

console.log('Importing Ticket...');
const Ticket = require('./Ticket')(sequelize);

console.log('Importing TicketQuestion...');
const TicketQuestion = require('./TicketQuestion')(sequelize);

console.log('Importing TicketResponse...');
const TicketResponse = require('./TicketResponse')(sequelize);

console.log('Importing TicketStaffRole...');
const TicketStaffRole = require('./TicketStaffRole')(sequelize);

console.log('Importing TicketLog...');
const TicketLog = require('./TicketLog')(sequelize);

console.log('Importing TicketTranscript...');
const TicketTranscript = require('./TicketTranscript')(sequelize);

console.log('Importing TicketCategory...');
const TicketCategory = require('./TicketCategory')(sequelize);

console.log('Importing PremiumUser...');
const PremiumUser = require('./PremiumUser')(sequelize);

console.log('Importing ModLogChannel...');
const ModLogChannel = require('./ModLogChannel')(sequelize);

console.log('Importing ModAlertChannel...');
const ModAlertChannel = require('./ModAlertChannel')(sequelize);

console.log('Importing CustomPlaceholder...');
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
