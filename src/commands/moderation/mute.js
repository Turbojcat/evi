const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { ModAction } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutes a user in the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to mute')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the mute'))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      const member = await interaction.guild.members.fetch(user.id);
      const mutedRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');

      if (!mutedRole) {
        await interaction.reply('The "Muted" role does not exist on this server. Please create it and try again.');
        return;
      }

      await member.roles.add(mutedRole);
      await interaction.reply(`Muted ${user.tag} in the server. Reason: ${reason}`);

      try {
        await ModAction.create({
          guildId: interaction.guild.id,
          moderatorId: interaction.user.id,
          action: 'Mute',
          targetId: user.id,
          reason: reason,
        });
      } catch (error) {
        console.error('Failed to log moderation action:', error);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to mute the user. Please check my permissions and try again.');
    }
  },
};
