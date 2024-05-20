// src/commands/ticket/ticketopen.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketopen')
    .setDescription('Opens a new ticket'),
  async execute(interaction) {
    // Code to open a new ticket and perform necessary actions
    // ...
  },
};
