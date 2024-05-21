// src/commands/ticket/ticketstats.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { Ticket } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketstats')
    .setDescription('Displays ticket statistics for the server'),
  async execute(interaction) {
    const guild = interaction.guild;

    try {
      const totalTickets = await Ticket.count({
        where: { guildId: guild.id },
      });

      const openTickets = await Ticket.count({
        where: { guildId: guild.id, status: 'open' },
      });

      const closedTickets = await Ticket.count({
        where: { guildId: guild.id, status: 'closed' },
      });

      const embed = new MessageEmbed()
        .setTitle('Ticket Statistics')
        .setDescription(`Ticket statistics for ${guild.name}`)
        .addField('Total Tickets', totalTickets)
        .addField('Open Tickets', openTickets)
        .addField('Closed Tickets', closedTickets)
        .setColor('#0099ff');

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error retrieving ticket statistics:', error);
      await interaction.reply({
        content: 'An error occurred while retrieving ticket statistics.',
        ephemeral: true,
      });
    }
  },
};