const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removewarning')
    .setDescription('Removes a warning from a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to remove a warning from')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('index')
        .setDescription('The index of the warning to remove')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const index = interaction.options.getInteger('index') - 1;

    try {
      // Hent advarslene for brukeren fra databasen
      // Eksempel: const warnings = await Warning.findAll({ where: { userId: user.id } });

      if (index < 0 || index >= warnings.length) {
        await interaction.reply('Invalid warning index.');
        return;
      }

      // Fjern advarselen fra databasen
      // Eksempel: await warnings[index].destroy();

      await interaction.reply(`Warning ${index + 1} has been removed from ${user.tag}.`);
    } catch (error) {
      console.error('Error removing warning:', error);
      await interaction.reply('An error occurred while removing the warning. Please try again later.');
    }
  },
};
