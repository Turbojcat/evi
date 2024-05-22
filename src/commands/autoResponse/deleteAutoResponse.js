// src/commands/autoResponse/deleteAutoResponse.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const AutoResponse = require('../../database/models/AutoResponse');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete-auto-response')
    .setDescription('Delete an auto-response')
    .addIntegerOption(option =>
      option.setName('id')
        .setDescription('The ID of the auto-response to delete')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  aliases: ['dar', 'delete-ar'],
  async execute(interaction) {
    const autoResponseId = interaction.options.getInteger('id');
    const userId = interaction.user.id;

    try {
      const autoResponse = await AutoResponse.findOne({ where: { id: autoResponseId, userId } });

      if (!autoResponse) {
        return interaction.reply('Auto-response not found or you do not have permission to delete it.');
      }

      const deletedAutoResponse = await autoResponse.destroy();

      const embed = new EmbedBuilder()
        .setTitle('Auto-Response Deleted')
        .setDescription('The auto-response has been deleted successfully.')
        .addFields(
          { name: 'Trigger', value: deletedAutoResponse.trigger },
          { name: 'Response', value: deletedAutoResponse.response },
          { name: 'ID', value: deletedAutoResponse.id.toString() }
        )
        .setColor('#ff0000')
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error deleting auto-response:', error);
      return interaction.reply('An error occurred while deleting the auto-response.');
    }
  },
};
