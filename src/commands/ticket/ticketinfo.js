// src/commands/ticket/ticketinfo.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketinfo')
    .setDescription('Displays ticket information for the user'),
  async execute(interaction) {
    const userId = interaction.user.id;
    // Code to retrieve ticket information for the user from the database
    // ...

    const embed = new MessageEmbed()
      .setTitle('Ticket Information')
      .setDescription(`Ticket information for <@${userId}>`)
      // Add fields for claimed tickets, assisted tickets, successful tickets, etc.
      // ...

    await interaction.reply({ embeds: [embed] });
  },
};
