// src/commands/ticket/ticketclaim.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketStaffRole } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketclaim')
    .setDescription('Claims the current ticket'),
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
          content: 'You do not have permission to claim tickets.',
          ephemeral: true,
        });
        return;
      }

      await ticketChannel.permissionOverwrites.create(interaction.user, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
      });

      await interaction.reply({
        content: `You have claimed this ticket.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error claiming ticket:', error);
      await interaction.reply({
        content: 'An error occurred while claiming the ticket.',
        ephemeral: true,
      });
    }
  },
};