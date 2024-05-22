// src/commands/customPlaceholder/editCustomPlaceholder.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const CustomPlaceholder = require('../../database/models/CustomPlaceholder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('edit-custom-placeholder')
    .setDescription('Edit an existing custom placeholder')
    .addStringOption(option =>
      option.setName('code')
        .setDescription('The code of the custom placeholder to edit')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('description')
        .setDescription('The new description for the custom placeholder')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  aliases: ['ecp', 'edit-cp'],
  async execute(interaction) {
    const code = interaction.options.getString('code');
    const newDescription = interaction.options.getString('description');
    const userId = interaction.user.id;

    try {
      const customPlaceholder = await CustomPlaceholder.findOne({ where: { code, userId } });

      if (!customPlaceholder) {
        return interaction.reply('Custom placeholder not found or you do not have permission to edit it.');
      }

      const updatedPlaceholder = await customPlaceholder.update({ description: newDescription });

      const embed = new EmbedBuilder()
        .setTitle('Custom Placeholder Updated')
        .setDescription('The custom placeholder has been updated successfully.')
        .addFields(
          { name: 'Code', value: updatedPlaceholder.code },
          { name: 'Old Description', value: customPlaceholder.description },
          { name: 'New Description', value: updatedPlaceholder.description },
          { name: 'ID', value: updatedPlaceholder.id.toString() }
        )
        .setColor('#ffd700')
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error editing custom placeholder:', error);
      return interaction.reply('An error occurred while editing the custom placeholder.');
    }
  },
};