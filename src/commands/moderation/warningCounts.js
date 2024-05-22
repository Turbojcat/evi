const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { Warnings } = require('../../database/models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warningcounts')
    .setDescription('Displays the warning count for each user'),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.MODERATE_MEMBERS)) {
      return interaction.reply({ content: 'You do not have permission to view warning counts.', ephemeral: true });
    }

    try {
      const warnings = await Warnings.findAll({
        where: { guildId: interaction.guild.id },
      });

      if (warnings.length === 0) {
        await interaction.reply('There are no warnings in this server.');
      } else {
        const userIds = [...new Set(warnings.map(warning => warning.userId))];
        const users = await interaction.client.users.fetch({ user: userIds });

        const warningCounts = userIds.map(userId => {
          const userWarnings = warnings.filter(warning => warning.userId === userId);
          const count = userWarnings.reduce((total, warning) => total + warning.count, 0);
          const user = users.get(userId);
          return `${user.tag}: ${count} warning(s)`;
        });

        await interaction.reply(`Warning Counts:\n${warningCounts.join('\n')}`);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error fetching the warning counts.', ephemeral: true });
    }
  },
};
