const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { ModLogChannel } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setlogchannel')
    .setDescription('Sets the channel for logging moderation actions')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to set as the log channel')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    try {
      await ModLogChannel.upsert({
        guildId: interaction.guildId,
        channelId: channel.id,
      });

      await interaction.reply(`Set ${channel} as the log channel.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to set the log channel. Please try again later.');
    }
  },
};
