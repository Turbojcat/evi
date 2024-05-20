// src/events/ticket/ticketQuestionResponse.js
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    const ticketChannel = message.channel;
    // Code to handle ticket question responses and perform necessary actions
    // ...
  },
};
