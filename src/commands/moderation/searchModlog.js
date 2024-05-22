const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('searchmodlog')
    .setDescription('Searches the moderation log')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('The search query')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.MODERATE_MEMBERS)) {
      return interaction.reply({ content: 'You do not have permission to search the moderation log.', ephemeral: true });
    }

    const logChannel = interaction.guild.channels.cache.find(channel => channel.name === 'moderation-log');
    if (!logChannel) {
      return interaction.reply({ content: 'There is no moderation log channel set up.', ephemeral: true });
    }

    const query = interaction.options.getString('query');
    const messages = await logChannel.messages.fetch({ limit: 100 });
    const searchResults = messages.filter(message => message.content.toLowerCase().includes(query.toLowerCase()));

    if (searchResults.size === 0) {
      return interaction.reply({ content: 'No matching entries found in the moderation log.', ephemeral: true });
    }

    const logEntries = searchResults.map(message => `[${message.createdAt.toLocaleString()}] ${message.content}`);

    const embed = new MessageEmbed()
      .setTitle(`Moderation Log Search Results for "${query}"`)
      .setDescription(logEntries.join('\n'))
      .setColor('#0099ff')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
