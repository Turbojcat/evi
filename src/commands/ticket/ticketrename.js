// src/commands/ticket/ticketrename.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketStaffRole } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketrename')
    .setDescription('Renames the current ticket')
    .addStringOption(option =>
      option.setName('name')
        .setDescription('The new name for the ticket')
        .setRequired(true)
    ),
  async execute(interaction) {
    const ticketChannel = interaction.channel;
    const ticketId = ticketChannel.name.split('-')[1];
    const newName = interaction.options.getString('name');

    try {
      const staffRoles = await TicketStaffRole.findAll({
        where: { guildId: interaction.guild.id },
      });

      const isStaff = staffRoles.some(role => interaction.member.roles.cache.has(role.roleId));

      if (!isStaff) {
        await interaction.reply({
          content: 'You do not have permission to rename tickets.',
          ephemeral: true,
        });
        return;
      }

      await ticketChannel.setName(`ticket-${ticketId}-${newName}`);

      await interaction.reply({
        content: `Ticket renamed to "${newName}".`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error renaming ticket:', error);
      await interaction.reply({
        content: 'An error occurred while renaming the ticket.',
        ephemeral: true,
      });
    }
  },
};