// src/commands/ticket/ticketadd.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketStaffRole } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketadd')
    .setDescription('Adds a user to the current ticket')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to add to the ticket')
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
          content: 'You do not have permission to add users to tickets.',
          ephemeral: true,
        });
        return;
      }

      await ticketChannel.permissionOverwrites.create(user, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
      });

      await interaction.reply({
        content: `Added ${user} to the ticket.`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error adding user to ticket:', error);
      await interaction.reply({
        content: 'An error occurred while adding the user to the ticket.',
        ephemeral: true,
      });
    }
  },
};