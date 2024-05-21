// src/events/interactions/interactionCreate.js

const { executeCommand } = require('../../handlers/commandHandler');
const { isPremiumUser } = require('../../utils/premium');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`[ERROR] No command matching "${interaction.commandName}" was found.`);
      return;
    }

    if (command.premium && !(await isPremiumUser(interaction.user.id))) {
      await interaction.reply({
        content: 'This command is only available for premium users.',
        ephemeral: true,
      });
      return;
    }

    try {
      await executeCommand(interaction);
    } catch (error) {
      console.error(`[ERROR] Error executing command "${command.data.name}":`, error);

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
      } else {
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
      }
    }
  },
};
