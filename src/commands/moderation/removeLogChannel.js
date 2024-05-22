const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { ModLogChannel } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removelogchannel')
    .setDescription('Removes the log channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction) {
    try {
      await ModLogChannel.destroy({
        where: { guildId: interaction.guildId },
      });

      await interaction.reply('Removed the log channel.');
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to remove the log channel. Please try again later.');
    }
  },
};
