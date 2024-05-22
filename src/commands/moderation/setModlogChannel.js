const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { ModSettings } = require('../../database/models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setmodlogchannel')
    .setDescription('Sets the moderation log channel')
    .addStringOption(option =>
      option.setName('channel')
        .setDescription('The channel name or ID to set as the moderation log channel')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.MANAGE_GUILD)) {
      return interaction.reply({ content: 'You do not have permission to set the moderation log channel.', ephemeral: true });
    }

    const channelInput = interaction.options.getString('channel');
    const channel = interaction.guild.channels.cache.find(
      c => c.name === channelInput || c.id === channelInput
    );

    if (!channel) {
      return interaction.reply({ content: 'Invalid channel name or ID. Please provide a valid channel.', ephemeral: true });
    }

    try {
      let settings = await ModSettings.findOne({ where: { guildId: interaction.guild.id } });
      if (!settings) {
        settings = await ModSettings.create({ guildId: interaction.guild.id });
      }

      settings.modLogChannelId = channel.id;
      await settings.save();

      await interaction.reply(`Moderation log channel set to ${channel}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error setting the moderation log channel.', ephemeral: true });
    }
  },
};
