// src/commands/ticket/ticketfeedback.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketFeedback, Ticket } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketfeedback')
    .setDescription('Provides feedback for a closed ticket')
    .addIntegerOption(option =>
      option.setName('rating')
        .setDescription('The rating for the ticket (1-5)')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('comment')
        .setDescription('Additional feedback comment')
    ),
  async execute(interaction) {
    const ticketId = interaction.channel.name.split('-')[1];
    const rating = interaction.options.getInteger('rating');
    const comment = interaction.options.getString('comment') || '';

    try {
      const ticket = await Ticket.findOne({ where: { id: ticketId } });

      if (!ticket || ticket.status !== 'closed') {
        await interaction.reply({ content: 'This ticket is not closed or does not exist.', ephemeral: true });
        return;
      }

      await TicketFeedback.create({
        ticketId,
        userId: interaction.user.id,
        rating,
        comment,
      });

      await interaction.reply({ content: 'Thank you for your feedback!', ephemeral: true });
    } catch (error) {
      console.error('Error submitting ticket feedback:', error);
      await interaction.reply({ content: 'An error occurred while submitting your feedback.', ephemeral: true });
    }
  },
};