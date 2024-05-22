// src/evi.js
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { TOKEN, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('./config');
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const { registerSlashCommands } = require('./handlers/slashCommandHandler');
const { connectDatabase, syncDatabase } = require('./database/database');
const { setupPermissionSystem } = require('./utils/permissionSystem');
const { initializeLogging } = require('./utils/logging');
const { scheduleJobs } = require('./jobs');
const path = require('path');
const config = require('./config');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
  restGlobalRateLimit: 50,
  restTimeOffset: 0,
  restRequestTimeout: 15000,
  GUILD_COMMAND_TIMEOUT: 3000,
});

client.commands = new Collection();
client.cooldowns = new Collection();

async function startBot() {
  try {
    initializeLogging();

    await connectDatabase();

    await syncDatabase();

    await loadCommands(client);

    await loadEvents(client);

    await registerSlashCommands(client);

    await setupPermissionSystem(client);

    await scheduleJobs(client);

    await client.login(TOKEN);
  } catch (error) {
    console.error('Error during bot startup:', error);
    process.exit(1);
  }
}

startBot();
