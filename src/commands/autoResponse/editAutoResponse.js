// src/commands/autoResponse/editAutoResponse.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const AutoResponse = require('../../database/models/AutoResponse');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('edit-auto-response')
    .setDescription('Edit an existing auto-response')
    .addIntegerOption(option =>
      option.setName('id')
        .setDescription('The ID of the auto-response to edit')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('trigger')
        .setDescription('The new trigger phrase for the auto-response')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('response')
        .setDescription('The new response message for the auto-response')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('aliases')
        .setDescription('Comma-separated list of aliases for the auto-response')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  aliases: ['ear', 'edit-ar'],
  async execute(interaction) {
    const autoResponseId = interaction.options.getInteger('id');
    const newTrigger = interaction.options.getString('trigger');
    const newResponse = interaction.options.getString('response');
    const newAliases = interaction.options.getString('aliases')?.split(',').map(alias => alias.trim()) || [];
    const userId = interaction.user.id;

    try {
      const autoResponse = await AutoResponse.findOne({ where: { id: autoResponseId, userId } });

      if (!autoResponse) {
        return interaction.reply('Auto-response not found or you do not have permission to edit it.');
      }

      const updatedAutoResponse = await autoResponse.update({
        trigger: newTrigger,
        response: newResponse,
        aliases: newAliases,
      });

      const embed = new EmbedBuilder()
        .setTitle('Auto-Response Updated')
        .setDescription('The auto-response has been updated successfully.')
        .addFields(
          { name: 'Old Trigger', value: autoResponse.trigger },
          { name: 'New Trigger', value: updatedAutoResponse.trigger },
          { name: 'Old Response', value: autoResponse.response },
          { name: 'New Response', value: updatedAutoResponse.response },
          { name: 'Old Aliases', value: autoResponse.aliases.length > 0 ? autoResponse.aliases.join(', ') : 'None' },
          { name: 'New Aliases', value: updatedAutoResponse.aliases.length > 0 ? updatedAutoResponse.aliases.join(', ') : 'None' },
          { name: 'ID', value: updatedAutoResponse.id.toString() }
        )
        .setColor('#ffd700')
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error editing auto-response:', error);
      return interaction.reply('An error occurred while editing the auto-response.');
    }
  },
};
