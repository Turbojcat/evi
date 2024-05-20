// src/events/ticket/ticketCreate.js
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const { customId } = interaction;

    if (customId === 'createTicket') {
      // Code to create a new ticket channel and perform necessary actions
      // ...
    }
  },
};
