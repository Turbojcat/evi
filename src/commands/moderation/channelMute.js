const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('channelmute')
    .setDescription('Mutes a user in a specific channel')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to mute in the channel')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to mute the user in')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('The duration of the mute in minutes')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const channel = interaction.options.getChannel('channel');
    const duration = interaction.options.getInteger('duration');

    try {
      await channel.permissionOverwrites.create(user, {
        SEND_MESSAGES: false,
      });

      setTimeout(async () => {
        await channel.permissionOverwrites.delete(user);
      }, duration * 60 * 1000);

      await interaction.reply(`Muted user ${user.tag} in channel ${channel.name} for ${duration} minutes.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to mute the user in the channel. Please check my permissions and try again.');
    }
  },
};
