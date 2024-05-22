const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { Warnings } = require('../../database/models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modstats')
    .setDescription('Displays moderation statistics for the server'),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.MODERATE_MEMBERS)) {
      return interaction.reply({ content: 'You do not have permission to view moderation statistics.', ephemeral: true });
    }

    try {
      const totalWarnings = await Warnings.count({ where: { guildId: interaction.guild.id } });
      const uniqueUsers = await Warnings.aggregate('userId', 'DISTINCT', { plain: false, where: { guildId: interaction.guild.id } });

      await interaction.reply(`Moderation Statistics:
- Total Warnings: ${totalWarnings}
- Unique Users Warned: ${uniqueUsers.length}`);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error fetching the moderation statistics.', ephemeral: true });
    }
  },
};
