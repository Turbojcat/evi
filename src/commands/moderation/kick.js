const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { ModAction } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the kick'))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.kick(reason);
      await interaction.reply(`Kicked ${user.tag} from the server. Reason: ${reason}`);

      try {
        await ModAction.create({
          guildId: interaction.guild.id,
          moderatorId: interaction.user.id,
          action: 'Kick',
          targetId: user.id,
          reason: reason,
        });
      } catch (error) {
        console.error('Failed to log moderation action:', error);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to kick the user. Please check my permissions and try again.');
    }
  },
};
