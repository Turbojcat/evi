// src/commands/ticket/ticketpriority.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketStaffRole, Ticket } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketpriority')
    .setDescription('Sets the priority of the current ticket')
    .addIntegerOption(option =>
      option.setName('priority')
        .setDescription('The priority level (1-5)')
        .setRequired(true)
    ),
  async execute(interaction) {
    const ticketChannel = interaction.channel;
    const ticketId = ticketChannel.name.split('-')[1];
    const priority = interaction.options.getInteger('priority');

    try {
      const staffRoles = await TicketStaffRole.findAll({
        where: { guildId: interaction.guild.id },
      });

      const isStaff = staffRoles.some(role => interaction.member.roles.cache.has(role.roleId));

      if (!isStaff) {
        await interaction.reply({
          content: 'You do not have permission to set ticket priorities.',
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

      await ticket.update({ priority });

      await interaction.reply({
        content: `Ticket priority set to ${priority}.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error setting ticket priority:', error);
      await interaction.reply({
        content: 'An error occurred while setting the ticket priority.',
        ephemeral: true,
      });
    }
  },
};