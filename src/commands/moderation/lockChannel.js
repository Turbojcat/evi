const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lockchannel')
    .setDescription('Locks a channel')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to lock')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    try {
      await channel.permissionOverwrites.create(interaction.guild.roles.everyone, {
        SEND_MESSAGES: false,
      });

      await interaction.reply(`Locked channel ${channel.name}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to lock the channel. Please check my permissions and try again.');
    }
  },
};
