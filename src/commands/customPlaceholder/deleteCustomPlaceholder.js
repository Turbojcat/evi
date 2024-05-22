// src/commands/customPlaceholder/deleteCustomPlaceholder.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const CustomPlaceholder = require('../../database/models/CustomPlaceholder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('delete-custom-placeholder')
    .setDescription('Delete a custom placeholder')
    .addStringOption(option =>
      option.setName('code')
        .setDescription('The code of the custom placeholder to delete')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  aliases: ['dcp', 'delete-cp'],
  async execute(interaction) {
    const code = interaction.options.getString('code');
    const userId = interaction.user.id;

    try {
      const customPlaceholder = await CustomPlaceholder.findOne({ where: { code, userId } });

      if (!customPlaceholder) {
        const embed = new EmbedBuilder()
          .setTitle('Custom Placeholder Not Found')
          .setDescription('The specified custom placeholder was not found or you do not have permission to delete it.')
          .setColor('#ff0000')
          .setTimestamp();

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }

      const deletedPlaceholder = await customPlaceholder.destroy();

      const embed = new EmbedBuilder()
        .setTitle('Custom Placeholder Deleted')
        .setDescription('The custom placeholder has been deleted successfully.')
        .addFields(
          { name: 'Code', value: deletedPlaceholder.code },
          { name: 'Description', value: deletedPlaceholder.description },
          { name: 'ID', value: deletedPlaceholder.id.toString() }
        )
        .setColor('#00ff00')
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error deleting custom placeholder:', error);

      const embed = new EmbedBuilder()
        .setTitle('Error')
        .setDescription('An error occurred while deleting the custom placeholder.')
        .setColor('#ff0000')
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
