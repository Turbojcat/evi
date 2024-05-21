const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketCategory } = require('../../database/database');
const { ChannelType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketcategory')
    .setDescription('Manages ticket categories')
    .addSubcommand(subcommand =>
      subcommand
        .setName('addcategory')
        .setDescription('Adds a new ticket category')
        .addChannelOption(option =>
          option.setName('category')
            .setDescription('The category to add as a ticket category')
            .setRequired(true)
            .addChannelTypes(ChannelType.GuildCategory)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('removecategory')
        .setDescription('Removes the existing ticket category')
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'addcategory') {
      await this.execute_addcategory(interaction);
    } else if (subcommand === 'removecategory') {
      await this.execute_removecategory(interaction);
    }
  },
  async execute_addcategory(interaction) {
    const category = interaction.options.getChannel('category');

    try {
      // Check if a ticket category already exists
      const existingCategory = await TicketCategory.findOne();

      if (existingCategory) {
        await interaction.reply({ content: 'A ticket category already exists. Please remove it before adding a new one.', ephemeral: true });
        return;
      }

      // Create a new ticket category
      const createdCategory = await TicketCategory.create({ categoryId: category.id });
      console.log('Created ticket category:', createdCategory);

      await interaction.reply({ content: 'Ticket category added successfully!', ephemeral: true });
    } catch (error) {
      console.error('Error adding ticket category:', error);
      await interaction.reply({ content: 'An error occurred while adding the ticket category.', ephemeral: true });
    }
  },
  async execute_removecategory(interaction) {
    try {
      // Find the existing ticket category
      const existingCategory = await TicketCategory.findOne();

      if (!existingCategory) {
        await interaction.reply({ content: 'No ticket category found.', ephemeral: true });
        return;
      }

      // Remove the ticket category
      await existingCategory.destroy();

      await interaction.reply({ content: 'Ticket category removed successfully!', ephemeral: true });
    } catch (error) {
      console.error('Error removing ticket category:', error);
      await interaction.reply({ content: 'An error occurred while removing the ticket category.', ephemeral: true });
    }
  },
};