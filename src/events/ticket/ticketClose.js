// src/events/ticket/ticketClose.js
const { MessageEmbed } = require('discord.js');
const { Ticket, TicketTranscript, TicketLog } = require('../../database/database');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const { customId } = interaction;

    if (customId === 'closeTicket') {
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

        await ticket.update({ status: 'closed', closedAt: new Date() });

        const transcript = await ticketChannel.messages.fetch({ limit: 100 });
        const transcriptText = transcript
          .map(message => `[${message.createdAt}] ${message.author.tag}: ${message.content}`)
          .join('\n');

        await TicketTranscript.create({
          ticketId: ticket.id,
          transcript: transcriptText,
        });

        const logChannel = await TicketLog.findOne({
          where: { guildId: interaction.guild.id },
        });

        if (logChannel) {
          const embed = new MessageEmbed()
            .setTitle(`Ticket Closed - #${ticket.id}`)
            .setDescription(`Ticket closed by ${interaction.user.tag}`)
            .setColor('#ff0000')
            .setTimestamp();

          await interaction.guild.channels.cache.get(logChannel.channelId).send({ embeds: [embed] });
        }

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
    }
  },
};