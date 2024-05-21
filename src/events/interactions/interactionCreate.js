const { executeCommand } = require('../../handlers/commandHandler');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`[ERROR] No command matching "${interaction.commandName}" was found.`);
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
}