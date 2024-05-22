const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions, MessageAttachment } = require('discord.js');
const fs = require('fs');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('exportmodlog')
    .setDescription('Exports the moderation log'),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.MODERATE_MEMBERS)) {
      return interaction.reply({ content: 'You do not have permission to export the moderation log.', ephemeral: true });
    }

    const logChannel = interaction.guild.channels.cache.find(channel => channel.name === 'moderation-log');
    if (!logChannel) {
      return interaction.reply({ content: 'There is no moderation log channel set up.', ephemeral: true });
    }

    const messages = await logChannel.messages.fetch({ limit: 100 });
    const logEntries = messages.map(message => `[${message.createdAt.toLocaleString()}] ${message.content}`);

    const logFile = `moderation-log-${interaction.guild.id}-${Date.now()}.txt`;
    fs.writeFileSync(logFile, logEntries.join('\n'));

    const attachment = new MessageAttachment(logFile);
    await interaction.reply({ content: 'Moderation log exported:', files: [attachment] });

    fs.unlinkSync(logFile);
  },
};
