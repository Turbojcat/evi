// evi.js
require('dotenv').config();
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { loadCommands, loadEvents } = require('./utils/loader');
const { DATABASE, OWNER_ID, TOKEN } = require('./config');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    // Add other necessary intents here
  ],
});

client.commands = new Collection();

(async () => {
  try {
    await loadCommands(client.commands);
    await loadEvents(client);
    await client.login(TOKEN);
  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
})();
