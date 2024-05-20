// src/events/ticket/ticketDelete.js
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const { customId } = interaction;

    if (customId === 'deleteTicket') {
      // Code to delete the ticket channel and perform necessary actions
      // ...
    } else if (customId === 'deleteTicketWithReason') {
      // Code to delete the ticket channel with a reason and perform necessary actions
      // ...
    }
  },
};
