const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channelunmute')
    .setDescription('Unmutes a user in a specific channel')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to unmute in the channel')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to unmute the user in')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const channel = interaction.options.getChannel('channel');

    try {
      await channel.permissionOverwrites.delete(user);

      await interaction.reply(`Unmuted user ${user.tag} in channel ${channel.name}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to unmute the user in the channel. Please check my permissions and try again.');
    }
  },
};
