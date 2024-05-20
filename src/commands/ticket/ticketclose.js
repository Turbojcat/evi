// src/commands/ticket/ticketclose.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketclose')
    .setDescription('Closes the current ticket'),
  async execute(interaction) {
    const ticketChannel = interaction.channel;
    // Code to close the ticket and perform necessary actions
    // ...
  },
};
