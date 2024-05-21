// src/commands/ticket/ticketcategory.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketCategory } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketcategory')
    .setDescription('Manages ticket categories')
    .addSubcommand(subcommand =>
      subcommand
        .setName('addcategory')
        .setDescription('Adds a category to the ticket system')
        .addStringOption(option =>
          option.setName('category')
            .setDescription('The category to add')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('removecategory')
        .setDescription('Removes a category from the ticket system')
        .addStringOption(option =>
          option.setName('category')
            .setDescription('The category to remove')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const category = interaction.options.getString('category');
    const guildId = interaction.guild.id;

    if (subcommand === 'add') {
      try {
        await TicketCategory.create({ guildId, category });
        await interaction.reply({ content: 'Category added successfully!', ephemeral: true });
      } catch (error) {
        console.error('Error adding category:', error);
        await interaction.reply({ content: 'An error occurred while adding the category.', ephemeral: true });
      }
    } else if (subcommand === 'remove') {
      try {
        await TicketCategory.destroy({ where: { guildId, category } });
        await interaction.reply({ content: 'Category removed successfully!', ephemeral: true });
      } catch (error) {
        console.error('Error removing category:', error);
        await interaction.reply({ content: 'An error occurred while removing the category.', ephemeral: true });
      }
    }
  },
};