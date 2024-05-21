// Import necessary modules from the discord.js library
const { Client, Collection, GatewayIntentBits } = require('discord.js');

// Import token and database configuration from the config file
const { TOKEN, DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = require('./config');

// Import utility functions from the handlers file
const { loadCommands } = require('./handlers/commandHandler');
const { loadEvents } = require('./handlers/eventHandler');
const { registerSlashCommands } = require('./handlers/slashCommandHandler');

// Import the database connection and sync functions from the database file
const { connectDatabase, syncDatabase } = require('./database/database');

// Import the permission system setup function from the permissionSystem file
const { setupPermissionSystem } = require('./utils/permissionSystem');

// Import the logging initialization function from the logging file
const { initializeLogging } = require('./utils/logging');

// Import the job scheduling function from the jobs file
const { scheduleJobs } = require('./jobs');

// Create a new Discord client instance with the specified intents
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

// Initialize the commands and cooldowns collections for the client
client.commands = new Collection();
client.cooldowns = new Collection();

// Use an immediately invoked async function to start the bot
async function startBot() {
  try {
    // Initialize the logging system
    initializeLogging();

    // Connect to the database
    await connectDatabase();

    // Sync the database models with the database
    await syncDatabase();

    // Load the command files and set them in the client's commands collection
    await loadCommands(client);

    // Load the event files and register them as event listeners on the client
    await loadEvents(client);

    // Register the slash commands with the Discord application
    await registerSlashCommands(client);

    // Set up the permission system for the bot
    await setupPermissionSystem(client);

    // Schedule any necessary jobs or tasks
    await scheduleJobs(client);

    // Log in to the Discord client using the provided token
    await client.login(TOKEN);
  } catch (error) {
    // If an error occurs during startup, log the error and exit the process
    console.error('Error during bot startup:', error);
    process.exit(1);
  }
}

startBot();