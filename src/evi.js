const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { TOKEN, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('./config');
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const { registerSlashCommands } = require('./handlers/slashCommandHandler');
const { connectDatabase } = require('./database/database');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
  ],
});

client.commands = new Collection();
client.cooldowns = new Collection();

(async () => {
  try {
    await connectDatabase();
    await loadCommands(client.commands);
    await loadEvents(client);
    await registerSlashCommands(client);
    await client.login(TOKEN);
  } catch (error) {
    console.error('Error during bot startup:', error);
    process.exit(1);
  }
})();
