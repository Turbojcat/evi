const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { ModLogChannel } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('viewmodlog')
    .setDescription('Views the moderation log')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),
  async execute(interaction) {
    try {
      const modLogChannel = await ModLogChannel.findOne({
        where: { guildId: interaction.guildId },
      });

      if (modLogChannel) {
        const channel = interaction.guild.channels.cache.get(modLogChannel.channelId);

        if (channel) {
          const messages = await channel.messages.fetch({ limit: 10 });
          const logEntries = messages.map(message => `[${message.createdAt.toLocaleString()}] ${message.content}`);

          const embed = {
            color: 0x00ff00,
            title: 'Moderation Log',
            description: logEntries.join('\n'),
            timestamp: new Date(),
          };

          await interaction.reply({ embeds: [embed] });
        } else {
          await interaction.reply('The moderation log channel is not configured correctly.');
        }
      } else {
        await interaction.reply('The moderation log channel is not set up.');
      }
    } catch (error) {
      console.error('Error viewing moderation log:', error);
      await interaction.reply('An error occurred while viewing the moderation log. Please try again later.');
    }
  },
};
