// src/events/ticket/ticketClaim.js
const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const { customId } = interaction;

    if (customId === 'claimTicket') {
      // Code to claim the ticket and perform necessary actions
      // ...
    }
  },
};
