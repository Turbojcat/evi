// src/commands/customPlaceholder/createCustomPlaceholder.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const CustomPlaceholder = require('../../database/models/CustomPlaceholder');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('create-custom-placeholder')
    .setDescription('Create a new custom placeholder')
    .addStringOption(option =>
      option.setName('code')
        .setDescription('The code for the custom placeholder')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('description')
        .setDescription('The description of the custom placeholder')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  aliases: ['ccp', 'create-cp'],
  async execute(interaction) {
    const code = interaction.options.getString('code');
    const description = interaction.options.getString('description');
    const userId = interaction.user.id;

    try {
      const existingPlaceholder = await CustomPlaceholder.findOne({ where: { code } });

      if (existingPlaceholder) {
        return interaction.reply('A custom placeholder with that code already exists.');
      }

      const createdPlaceholder = await CustomPlaceholder.create({ userId, code, description });

      const embed = new EmbedBuilder()
        .setTitle('Custom Placeholder Created')
        .setDescription('A new custom placeholder has been created successfully.')
        .addFields(
          { name: 'Code', value: createdPlaceholder.code },
          { name: 'Description', value: createdPlaceholder.description },
          { name: 'ID', value: createdPlaceholder.id.toString() }
        )
        .setColor('#00ff00')
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error creating custom placeholder:', error);
      return interaction.reply('An error occurred while creating the custom placeholder.');
    }
  },
};
