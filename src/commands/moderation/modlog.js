const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');
const { ModSettings } = require('../../database/models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modlog')
    .setDescription('Displays the moderation log')
    .addIntegerOption(option =>
      option.setName('page')
        .setDescription('The page number of the moderation log')
        .setMinValue(1)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.MODERATE_MEMBERS)) {
      return interaction.reply({ content: 'You do not have permission to view the moderation log.', ephemeral: true });
    }

    try {
      const settings = await ModSettings.findOne({ where: { guildId: interaction.guild.id } });
      if (!settings || !settings.modLogChannelId) {
        return interaction.reply({ content: 'There is no moderation log channel set up.', ephemeral: true });
      }

      const logChannelId = settings.modLogChannelId;
      const logChannel = interaction.guild.channels.cache.get(logChannelId);
      if (!logChannel) {
        return interaction.reply({ content: 'The configured moderation log channel does not exist.', ephemeral: true });
      }

      const page = interaction.options.getInteger('page') || 1;
      const pageSize = 10;
      const messages = await logChannel.messages.fetch({ limit: pageSize, before: (page - 1) * pageSize });

      if (messages.size === 0) {
        return interaction.reply({ content: 'There are no entries in the moderation log.', ephemeral: true });
      }

      const logEntries = messages.map(message => `[${message.createdAt.toLocaleString()}] ${message.content}`);

      const embed = new MessageEmbed()
        .setTitle(`Moderation Log - Page ${page}`)
        .setDescription(logEntries.join('\n'))
        .setColor('#0099ff')
        .setTimestamp();

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error retrieving the moderation log.', ephemeral: true });
    }
  },
};
