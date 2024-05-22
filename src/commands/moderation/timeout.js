const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { ModAction } = require('../../database/models/ModAction');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Applies a timeout to a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to timeout')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('The duration of the timeout in minutes')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the timeout'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.timeout(duration * 60 * 1000, reason);
      await interaction.reply(`Applied a timeout of ${duration} minutes to ${user.tag}. Reason: ${reason}`);

      try {
        await ModAction.create({
          guildId: interaction.guild.id,
          moderatorId: interaction.user.id,
          action: 'Timeout',
          targetId: user.id,
          reason: reason,
        });
      } catch (error) {
        console.error('Failed to log moderation action:', error);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to apply a timeout to the user. Please check my permissions and try again.');
    }
  },
};
