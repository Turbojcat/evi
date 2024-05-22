const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { Warnings } = require('../../database/models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarnings')
    .setDescription('Clears all warnings from a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to clear warnings from')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.MODERATE_MEMBERS)) {
      return interaction.reply({ content: 'You do not have permission to clear warnings.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');

    try {
      const rowsDeleted = await Warnings.destroy({
        where: { userId: user.id, guildId: interaction.guild.id },
      });

      if (rowsDeleted === 0) {
        await interaction.reply(`${user.tag} has no warnings to clear.`);
      } else {
        await interaction.reply(`Cleared all warnings from ${user.tag}.`);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error clearing the warnings.', ephemeral: true });
    }
  },
};
