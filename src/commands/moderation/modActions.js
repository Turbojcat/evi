const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const { ModAction } = require('../../database/database.js');
const { sequelize } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modactions')
    .setDescription('Displays the number of moderation actions performed by each moderator'),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.MODERATE_MEMBERS)) {
      return interaction.reply({ content: 'You do not have permission to view moderation actions.', ephemeral: true });
    }

    try {
      const modActions = await ModAction.findAll({
        where: { guildId: interaction.guild.id },
        attributes: ['moderatorId', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
        group: ['moderatorId'],
      });

      if (modActions.length === 0) {
        return interaction.reply({ content: 'No moderation actions have been recorded.', ephemeral: true });
      }

      const moderatorIds = modActions.map(action => action.moderatorId);
      const moderators = await interaction.guild.members.fetch({ user: moderatorIds });

      const actionCounts = modActions.map(action => {
        const moderator = moderators.get(action.moderatorId);
        return `${moderator.user.tag}: ${action.get('count')} actions`;
      });

      const embed = new MessageEmbed()
        .setTitle('Moderation Action Counts')
        .setDescription(actionCounts.join('\n'))
        .setColor('#0099ff')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error retrieving moderation action counts.', ephemeral: true });
    }
  },
};
