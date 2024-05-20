// Import the necessary modules
const fs = require('fs');
const path = require('path');

// Function to load command files from the 'commands' directory
async function loadCommands(client) {
  // Get an array of command folder names in the 'commands' directory
  const commandFolders = fs.readdirSync(path.join(__dirname, '..', 'commands'));

  // Loop through each command folder
  for (const folder of commandFolders) {
    // Get an array of command file names in the current folder
    const commandFiles = fs.readdirSync(path.join(__dirname, '..', 'commands', folder)).filter(file => file.endsWith('.js'));

    // Loop through each command file
    for (const file of commandFiles) {
      // Import the command file
      const command = require(path.join(__dirname, '..', 'commands', folder, file));
      // Set the command in the client's commands collection using its name as the key
      client.commands.set(command.name, command);
    }
  }

  console.log('Commands loaded');
}

// Function to load event files from the 'events' directory
async function loadEvents(client) {
  // Get an array of event folder names in the 'events' directory
  const eventFolders = fs.readdirSync(path.join(__dirname, '..', 'events'));

  // Loop through each event folder
  for (const folder of eventFolders) {
    // Get an array of event file names in the current folder
    const eventFiles = fs.readdirSync(path.join(__dirname, '..', 'events', folder)).filter(file => file.endsWith('.js'));

    // Loop through each event file
    for (const file of eventFiles) {
      // Import the event file
      const event = require(path.join(__dirname, '..', 'events', folder, file));
      // If the event has the 'once' property set to true, register it as a one-time event
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        // Otherwise, register it as a regular event
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }
  }

  console.log('Events loaded');
}

// Function to register slash commands with the Discord application
async function registerSlashCommands(client) {
  // Get an array of slash command data from the client's commands collection
  const slashCommands = client.commands.filter(cmd => cmd.data).map(cmd => cmd.data.toJSON());

  try {
    console.log('Registering slash commands...');
    // Register the slash commands with the Discord application
    await client.application.commands.set(slashCommands);
    console.log('Slash commands registered');
  } catch (error) {
    console.error('Error registering slash commands:', error);
  }
}

// Export the functions for use in other files
module.exports = {
  loadCommands,
  loadEvents,
  registerSlashCommands,
};
