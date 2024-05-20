const fs = require('fs');
const path = require('path');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { DISCORD_TOKEN, CLIENT_ID, GUILD_ID } = require('../config');

function loadSlashCommands() {
  const slashCommandsPath = path.join(__dirname, '..', 'slashCommands');
  const slashCommandFiles = fs.readdirSync(slashCommandsPath).filter(file => file.endsWith('.js'));

  const slashCommands = [];

  for (const file of slashCommandFiles) {
    const filePath = path.join(slashCommandsPath, file);
    const command = require(filePath);
    slashCommands.push(command.data.toJSON());
  }

  return slashCommands;
}

async function registerSlashCommands(client) {
  const rest = new REST({ version: '9' }).setToken(DISCORD_TOKEN);

  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: loadSlashCommands() },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  loadSlashCommands,
  registerSlashCommands,
};
