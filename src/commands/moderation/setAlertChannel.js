const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { ModAlertChannel } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setalertchannel')
    .setDescription('Sets the channel for sending moderation alerts')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to set as the alert channel')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    try {
      await ModAlertChannel.upsert({
        guildId: interaction.guildId,
        channelId: channel.id,
      });

      await interaction.reply(`Set ${channel} as the alert channel.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to set the alert channel. Please try again later.');
    }
  },
};
