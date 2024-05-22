const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlockchannel')
    .setDescription('Unlocks a channel')
    .addChannelOption(option =>
      option.setName('channel')
        .setDescription('The channel to unlock')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false),
  async execute(interaction) {
    const channel = interaction.options.getChannel('channel');

    try {
      await channel.permissionOverwrites.delete(interaction.guild.roles.everyone);

      await interaction.reply(`Unlocked channel ${channel.name}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to unlock the channel. Please check my permissions and try again.');
    }
  },
};
