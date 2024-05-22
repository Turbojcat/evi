const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { ModAlertChannel } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removealertchannel')
    .setDescription('Removes the alert channel')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction) {
    try {
      await ModAlertChannel.destroy({
        where: { guildId: interaction.guildId },
      });

      await interaction.reply('Removed the alert channel.');
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to remove the alert channel. Please try again later.');
    }
  },
};
