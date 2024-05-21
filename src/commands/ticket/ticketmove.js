// src/commands/ticket/ticketmove.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketStaffRole } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketmove')
    .setDescription('Moves the current ticket to a different category')
    .addChannelOption(option =>
      option.setName('category')
        .setDescription('The category to move the ticket to')
        .setRequired(true)
    ),
  async execute(interaction) {
    const ticketChannel = interaction.channel;
    const ticketId = ticketChannel.name.split('-')[1];
    const category = interaction.options.getChannel('category');

    try {
      const staffRoles = await TicketStaffRole.findAll({
        where: { guildId: interaction.guild.id },
      });

      const isStaff = staffRoles.some(role => interaction.member.roles.cache.has(role.roleId));

      if (!isStaff) {
        await interaction.reply({
          content: 'You do not have permission to move tickets.',
          ephemeral: true,
        });
        return;
      }

      await ticketChannel.setParent(category);

      await interaction.reply({
        content: `Ticket moved to category "${category.name}".`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error moving ticket:', error);
      await interaction.reply({
        content: 'An error occurred while moving the ticket.',
        ephemeral: true,
      });
    }
  },
};