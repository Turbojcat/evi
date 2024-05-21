// src/commands/ticket/ticketremove.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketStaffRole } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketremove')
    .setDescription('Removes a user from the current ticket')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to remove from the ticket')
        .setRequired(true)
    ),
  async execute(interaction) {
    const ticketChannel = interaction.channel;
    const ticketId = ticketChannel.name.split('-')[1];
    const user = interaction.options.getUser('user');

    try {
      const staffRoles = await TicketStaffRole.findAll({
        where: { guildId: interaction.guild.id },
      });

      const isStaff = staffRoles.some(role => interaction.member.roles.cache.has(role.roleId));

      if (!isStaff) {
        await interaction.reply({
          content: 'You do not have permission to remove users from tickets.',
          ephemeral: true,
        });
        return;
      }

      await ticketChannel.permissionOverwrites.delete(user);

      await interaction.reply({
        content: `Removed ${user} from the ticket.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error removing user from ticket:', error);
      await interaction.reply({
        content: 'An error occurred while removing the user from the ticket.',
        ephemeral: true,
      });
    }
  },
};