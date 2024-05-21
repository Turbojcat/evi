// src/commands/ticket/ticketexport.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageAttachment } = require('discord.js');
const { TicketStaffRole, Ticket, TicketTranscript } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketexport')
    .setDescription('Exports the current ticket as a text file'),
  async execute(interaction) {
    const ticketChannel = interaction.channel;
    const ticketId = ticketChannel.name.split('-')[1];

    try {
      const staffRoles = await TicketStaffRole.findAll({
        where: { guildId: interaction.guild.id },
      });

      const isStaff = staffRoles.some(role => interaction.member.roles.cache.has(role.roleId));

      if (!isStaff) {
        await interaction.reply({
          content: 'You do not have permission to export tickets.',
          ephemeral: true,
        });
        return;
      }

      const ticket = await Ticket.findOne({ where: { id: ticketId } });

      if (!ticket) {
        await interaction.reply({
          content: 'This channel is not a valid ticket.',
          ephemeral: true,
        });
        return;
      }

      const transcript = await TicketTranscript.findOne({ where: { ticketId } });

      let exportText = `Ticket Export - #${ticket.id}\n\n`;
      exportText += `Creator: ${ticket.creatorId}\n`;
      exportText += `Title: ${ticket.title}\n`;
      exportText += `Description: ${ticket.description}\n`;
      exportText += `Status: ${ticket.status}\n`;
      exportText += `Priority: ${ticket.priority}\n`;
      exportText += `Created At: ${ticket.createdAt}\n`;
      exportText += `Closed At: ${ticket.closedAt || 'N/A'}\n\n`;

      if (transcript) {
        exportText += `Transcript:\n${transcript.transcript}`;
      }

      const attachment = new MessageAttachment(Buffer.from(exportText), `ticket-${ticket.id}.txt`);

      await interaction.reply({ files: [attachment], ephemeral: true });
    } catch (error) {
      console.error('Error exporting ticket:', error);
      await interaction.reply({
        content: 'An error occurred while exporting the ticket.',
        ephemeral: true,
      });
    }
  },
};