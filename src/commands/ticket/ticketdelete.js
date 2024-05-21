// src/commands/ticket/ticketdelete.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketStaffRole, Ticket, TicketTranscript } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketdelete')
    .setDescription('Deletes the current ticket and its associated data'),
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
          content: 'You do not have permission to delete tickets.',
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

      await TicketTranscript.destroy({ where: { ticketId } });
      await ticket.destroy();
      await ticketChannel.delete();

      await interaction.reply({
        content: 'Ticket deleted successfully.',
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error deleting ticket:', error);
      await interaction.reply({
        content: 'An error occurred while deleting the ticket.',
        ephemeral: true,
      });
    }
  },
};