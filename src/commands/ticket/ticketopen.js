// src/commands/ticket/ticketopen.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { Ticket } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketopen')
    .setDescription('Opens a new ticket'),
  async execute(interaction) {
    const guild = interaction.guild;
    const creator = interaction.user;

    try {
      const ticket = await Ticket.create({
        guildId: guild.id,
        creatorId: creator.id,
        status: 'open',
      });

      const ticketChannel = await guild.channels.create(`ticket-${ticket.id}`, {
        type: 'text',
        topic: `Ticket created by ${creator.tag}`,
        permissionOverwrites: [
          {
            id: guild.id,
            deny: ['VIEW_CHANNEL'],
          },
          {
            id: creator.id,
            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
          },
        ],
      });

      await interaction.reply({
        content: `Your ticket has been created in ${ticketChannel}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error opening ticket:', error);
      await interaction.reply({
        content: 'An error occurred while opening the ticket.',
        ephemeral: true,
      });
    }
  },
};