const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { ModAction } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the ban'))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      await interaction.guild.members.ban(user, { reason });
      await interaction.reply(`Banned ${user.tag} from the server. Reason: ${reason}`);

      try {
        await ModAction.create({
          guildId: interaction.guild.id,
          moderatorId: interaction.user.id,
          action: 'Ban',
          targetId: user.id,
          reason: reason,
        });
      } catch (error) {
        console.error('Failed to log moderation action:', error);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to ban the user. Please check my permissions and try again.');
    }
  },
};
