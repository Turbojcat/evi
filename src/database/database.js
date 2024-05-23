const { Sequelize, DataTypes } = require('sequelize');
const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('../config');

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: 'mysql',
  logging: false,
});

const User = sequelize.define('User', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  discordId: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  wallet: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  bank: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  dailyStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastDailyTimestamp: {
    type: DataTypes.DATE,
  },
  weeklyStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastWeeklyTimestamp: {
    type: DataTypes.DATE,
  },
  monthlyStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastMonthlyTimestamp: {
    type: DataTypes.DATE,
  },
  workStreak: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastWorkTimestamp: {
    type: DataTypes.DATE,
  },
  inventory: {
    type: DataTypes.JSON,
    defaultValue: {},
  },
  fishingRod: {
    type: DataTypes.STRING,
  },
  fishingBait: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  lastFishingTimestamp: {
    type: DataTypes.DATE,
  },
  miningPick: {
    type: DataTypes.STRING,
  },
  lastMiningTimestamp: {
    type: DataTypes.DATE,
  },
  woodcuttingAxe: {
    type: DataTypes.STRING,
  },
  lastWoodcuttingTimestamp: {
    type: DataTypes.DATE,
  },
});

const ModAction = sequelize.define('ModAction', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  guildId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  moderatorId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  targetId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  reason: {
    type: DataTypes.TEXT,
  },
});

const Ticket = require('./models/Ticket')(sequelize, DataTypes);
const TicketQuestion = require('./models/TicketQuestion')(sequelize, DataTypes);
const TicketResponse = require('./models/TicketResponse')(sequelize, DataTypes);
const TicketStaffRole = require('./models/TicketStaffRole')(sequelize, DataTypes);
const TicketLog = require('./models/TicketLog')(sequelize, DataTypes);
const TicketTranscript = require('./models/TicketTranscript')(sequelize, DataTypes);
const TicketCategory = require('./models/TicketCategory')(sequelize, DataTypes);
const PremiumUser = require('./models/PremiumUser')(sequelize, DataTypes);
const ModLogChannel = require('./models/ModLogChannel')(sequelize, DataTypes);
const ModAlertChannel = require('./models/ModAlertChannel')(sequelize, DataTypes);
const CustomPlaceholder = require('./models/CustomPlaceholder')(sequelize, DataTypes);

const models = {
  User,
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
  ModAction,
};

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

async function syncDatabase() {
  try {
    await sequelize.sync();
    console.log('Database models synced');
    await ModAction.sync();
  } catch (error) {
    console.error('Error syncing database models:', error);
  }
}

module.exports = {
  connectToDatabase,
  syncDatabase,
  sequelize,
  ...models,
  ModAction,
};
