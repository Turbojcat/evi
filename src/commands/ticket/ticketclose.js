// src/commands/ticket/ticketclose.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Ticket, TicketTranscript } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketclose')
    .setDescription('Closes the current ticket'),
  async execute(interaction) {
    const ticketChannel = interaction.channel;
    const ticketId = ticketChannel.name.split('-')[1];

    try {
      const ticket = await Ticket.findOne({ where: { id: ticketId } });

      if (!ticket) {
        await interaction.reply({
          content: 'This channel is not a valid ticket.',
          ephemeral: true,
        });
        return;
      }

      if (ticket.status === 'closed') {
        await interaction.reply({
          content: 'This ticket is already closed.',
          ephemeral: true,
        });
        return;
      }

      await ticket.update({ status: 'closed' });

      const transcript = await ticketChannel.messages.fetch({ limit: 100 });
      const transcriptText = transcript
        .map(message => `[${message.createdAt}] ${message.author.tag}: ${message.content}`)
        .join('\n');

      await TicketTranscript.create({
        ticketId: ticket.id,
        transcript: transcriptText,
      });

      await ticketChannel.delete();

      await interaction.reply({
        content: 'Ticket closed successfully.',
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error closing ticket:', error);
      await interaction.reply({
        content: 'An error occurred while closing the ticket.',
        ephemeral: true,
      });
    }
  },
};