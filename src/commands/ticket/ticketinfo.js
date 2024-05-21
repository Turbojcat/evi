// src/commands/ticket/ticketinfo.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Ticket } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketinfo')
    .setDescription('Displays ticket information for the user'),
  async execute(interaction) {
    const userId = interaction.user.id;

    try {
      const tickets = await Ticket.findAll({
        where: { creatorId: userId },
      });

      const totalTickets = tickets.length;
      const openTickets = tickets.filter(ticket => ticket.status === 'open').length;
      const closedTickets = tickets.filter(ticket => ticket.status === 'closed').length;

      const embed = new MessageEmbed()
        .setTitle('Ticket Information')
        .setDescription(`Ticket information for <@${userId}>`)
        .addField('Total Tickets', totalTickets)
        .addField('Open Tickets', openTickets)
        .addField('Closed Tickets', closedTickets)
        .setColor('#0099ff');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error retrieving ticket information:', error);
      await interaction.reply({
        content: 'An error occurred while retrieving ticket information.',
        ephemeral: true,
      });
    }
  },
};