// src/commands/ticket/ticketunclaim.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketStaffRole } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketunclaim')
    .setDescription('Unclaims the current ticket'),
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
          content: 'You do not have permission to unclaim tickets.',
          ephemeral: true,
        });
        return;
      }

      await ticketChannel.permissionOverwrites.delete(interaction.user);

      await interaction.reply({
        content: `You have unclaimed this ticket.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error unclaiming ticket:', error);
      await interaction.reply({
        content: 'An error occurred while unclaiming the ticket.',
        ephemeral: true,
      });
    }
  },
};