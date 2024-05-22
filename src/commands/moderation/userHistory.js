const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userhistory')
    .setDescription('Displays the moderation history of a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to view the moderation history of')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.MODERATE_MEMBERS)) {
      return interaction.reply({ content: 'You do not have permission to view user moderation history.', ephemeral: true });
    }

    const logChannel = interaction.guild.channels.cache.find(channel => channel.name === 'moderation-log');
    if (!logChannel) {
      return interaction.reply({ content: 'There is no moderation log channel set up.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const messages = await logChannel.messages.fetch({ limit: 100 });
    const userHistory = messages.filter(message => message.content.includes(user.id));

    if (userHistory.size === 0) {
      return interaction.reply({ content: `No moderation history found for ${user.tag}.`, ephemeral: true });
    }

    const logEntries = userHistory.map(message => `[${message.createdAt.toLocaleString()}] ${message.content}`);

    const embed = new MessageEmbed()
      .setTitle(`Moderation History for ${user.tag}`)
      .setDescription(logEntries.join('\n'))
      .setColor('#0099ff')
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
