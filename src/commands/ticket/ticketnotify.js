// src/commands/ticket/ticketnotify.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketStaffRole } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketnotify')
    .setDescription('Notifies staff members about the current ticket')
    .addStringOption(option =>
      option.setName('message')
        .setDescription('The notification message')
        .setRequired(true)
    ),
  async execute(interaction) {
    const ticketChannel = interaction.channel;
    const ticketId = ticketChannel.name.split('-')[1];
    const message = interaction.options.getString('message');

    try {
      const staffRoles = await TicketStaffRole.findAll({
        where: { guildId: interaction.guild.id },
      });

      const isStaff = staffRoles.some(role => interaction.member.roles.cache.has(role.roleId));

      if (!isStaff) {
        await interaction.reply({
          content: 'You do not have permission to notify staff members.',
          ephemeral: true,
        });
        return;
      }

      const staffMembers = interaction.guild.members.cache.filter(member =>
        staffRoles.some(role => member.roles.cache.has(role.roleId))
      );

      const notification = `New notification for ticket #${ticketId}:\n${message}`;

      for (const [id, member] of staffMembers) {
        try {
          await member.send(notification);
        } catch (error) {
          console.error(`Error sending notification to staff member ${id}:`, error);
        }
      }

      await interaction.reply({
        content: 'Staff members have been notified.',
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error notifying staff members:', error);
      await interaction.reply({
        content: 'An error occurred while notifying staff members.',
        ephemeral: true,
      });
    }
  },
};