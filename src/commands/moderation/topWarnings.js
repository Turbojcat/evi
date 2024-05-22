const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { Warnings } = require('../../database/models');
const { Op } = require('sequelize');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('topwarnings')
    .setDescription('Displays the top 10 users with the most warnings'),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.MODERATE_MEMBERS)) {
      return interaction.reply({ content: 'You do not have permission to view top warnings.', ephemeral: true });
    }

    try {
      const topWarnings = await Warnings.findAll({
        where: { guildId: interaction.guild.id },
        order: [['count', 'DESC']],
        limit: 10,
      });

      if (topWarnings.length === 0) {
        await interaction.reply('There are no warnings in this server.');
      } else {
        const userIds = topWarnings.map(warning => warning.userId);
        const users = await interaction.client.users.fetch({ user: userIds });

        const warningsList = topWarnings.map((warning, index) => {
          const user = users.get(warning.userId);
          return `${index + 1}. ${user.tag}: ${warning.count} warning(s)`;
        });

        await interaction.reply(`Top 10 Users with the Most Warnings:\n${warningsList.join('\n')}`);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error fetching the top warnings.', ephemeral: true });
    }
  },
};
