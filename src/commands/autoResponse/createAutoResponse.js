// src/commands/autoResponse/createAutoResponse.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const AutoResponse = require('../../database/models/AutoResponse');
const { AUTO_RESPONSE_FREE_LIMIT, AUTO_RESPONSE_PREMIUM_LIMIT } = require('../../config');
const { replacePlaceholders } = require('../../utils/placeholders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-auto-response')
    .setDescription('Create a new auto-response')
    .addStringOption(option =>
      option.setName('trigger')
        .setDescription('The trigger phrase for the auto-response')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('response')
        .setDescription('The response message for the auto-response')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('aliases')
        .setDescription('Comma-separated list of aliases for the auto-response')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  aliases: ['car', 'create-ar'],
  async execute(interaction) {
    const trigger = interaction.options.getString('trigger');
    const response = interaction.options.getString('response');
    const aliases = interaction.options.getString('aliases')?.split(',').map(alias => alias.trim()) || [];
    const userId = interaction.user.id;

    try {
      const userAutoResponses = await AutoResponse.count({ where: { userId } });
      const isPremiumUser = await checkPremiumStatus(userId); // Implement the premium status check logic

      const autoResponseLimit = isPremiumUser ? AUTO_RESPONSE_PREMIUM_LIMIT : AUTO_RESPONSE_FREE_LIMIT;

      if (userAutoResponses >= autoResponseLimit) {
        return interaction.reply(`You have reached the maximum limit of ${autoResponseLimit} auto-responses.`);
      }

      const processedResponse = await replacePlaceholders(response, interaction);

      const createdAutoResponse = await AutoResponse.create({ userId, trigger, response: processedResponse, aliases });

      const embed = new EmbedBuilder()
        .setTitle('Auto-Response Created')
        .setDescription('A new auto-response has been created successfully.')
        .addFields(
          { name: 'Trigger', value: trigger },
          { name: 'Response', value: processedResponse },
          { name: 'Aliases', value: aliases.length > 0 ? aliases.join(', ') : 'None' },
          { name: 'ID', value: createdAutoResponse.id.toString() }
        )
        .setColor('#00ff00')
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error creating auto-response:', error);
      return interaction.reply('An error occurred while creating the auto-response.');
    }
  },
};
