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
          slashCommands.push(command.data.toJSON());
        }
      }
    }
  }

  await traverseDirectory(directory);
  return slashCommands;
}

async function registerSlashCommands(client) {
  const rest = new REST({ version: '9' }).setToken(TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');

    const slashCommands = await findSlashCommandFiles(path.join(__dirname, '..'));

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
