const fs = require('fs');
const path = require('path');
const { Collection } = require('discord.js');

async function loadCommands(client) {
  client.commands = new Collection();

  const commandsPath = path.join(__dirname, '..', 'commands');
  const commandFolders = fs.readdirSync(commandsPath);

  for (const folder of commandFolders) {
    const folderPath = path.join(commandsPath, folder);
    const commandFiles = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
      const filePath = path.join(folderPath, file);
      const command = require(filePath);

      if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`[COMMAND] Loaded command: ${command.data.name}`);

        if (command.data.options) {
          command.data.options.forEach(option => {
            if (option.type === 'SUB_COMMAND' || option.type === 'SUB_COMMAND_GROUP') {
              const subcommandName = option.name;
              const subcommandExecute = command[`execute_${subcommandName}`];

              if (!subcommandExecute) {
                console.log(`[WARNING] Subcommand "${subcommandName}" of command "${command.data.name}" is missing an execute function.`);
              } else {
                console.log(`[SUBCOMMAND] Loaded subcommand: ${command.data.name}.${subcommandName}`);
              }
            }
          });
        }
      } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
      }
    }
  }
}

async function executeCommand(interaction) {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`[ERROR] No command matching "${interaction.commandName}" was found.`);
    return;
  }

  try {
    if (interaction.isChatInputCommand()) {
      if (command.data.options && command.data.options.some(option => option.type === 1)) {
        const subcommand = interaction.options.getSubcommand(false);
        if (subcommand) {
          const subcommandFile = interaction.client.commands.get(`${interaction.commandName}-${subcommand}`);
          if (subcommandFile) {
            await subcommandFile.execute(interaction);
          } else {
            await interaction.reply({ content: 'Invalid subcommand.', ephemeral: true });
          }
        } else {
          await command.execute(interaction);
        }
      } else {
        await command.execute(interaction);
      }
    } else if (interaction.isContextMenuCommand()) {
      await command.execute(interaction);
    }
  } catch (error) {
    console.error(`[ERROR] Error executing command "${command.data.name}":`, error);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
    } else {
      await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
  }
}

module.exports = {
  loadCommands,
  executeCommand,
};