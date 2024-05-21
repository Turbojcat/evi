const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { TOKEN, CLIENT_ID, GUILD_ID } = require('../config');

async function findSlashCommandFiles(directory) {
  const slashCommands = [];

  async function traverseDirectory(currentDir) {
    const files = await fs.promises.readdir(currentDir);

    for (const file of files) {
      const filePath = path.join(currentDir, file);
      const stat = await fs.promises.stat(filePath);

      if (stat.isDirectory()) {
        await traverseDirectory(filePath);
      } else if (file.endsWith('.js')) {
        const command = require(filePath);
        if ('data' in command && 'execute' in command) {
          slashCommands.push(command.data);
        }
      }
    }
  }

  await traverseDirectory(directory);
  
  // Add the /help command
  return slashCommands;
}

async function registerSlashCommands(client) {
  const rest = new REST({ version: '9' }).setToken(TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');

    const slashCommands = await findSlashCommandFiles(path.join(__dirname, '..'));

    // Log the names of the slash commands
    console.log('Slash command names:', slashCommands.map(command => command.name));

    // Check for duplicate slash command names
    const commandNames = slashCommands.map(command => command.name);
    const duplicateCommands = commandNames.filter((name, index) => commandNames.indexOf(name) !== index);

    if (duplicateCommands.length > 0) {
      console.error('Duplicate slash commands found:', duplicateCommands);
      return;
    }

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: slashCommands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  registerSlashCommands,
};