const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('servervoiceunmute')
    .setDescription('Unmutes a user in all voice channels')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to unmute in all voice channels')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
      const member = await interaction.guild.members.fetch(user.id);
      const voiceChannel = member.voice.channel;

      if (voiceChannel) {
        await member.voice.setMute(false);
      }

      await interaction.reply(`Unmuted user ${user.tag} in all voice channels.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to unmute the user in all voice channels. Please check my permissions and try again.');
    }
  },
};
