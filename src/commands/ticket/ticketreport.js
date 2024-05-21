// src/commands/ticket/ticketreport.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { TicketStaffRole, Ticket, TicketTranscript } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketreport')
    .setDescription('Generates a report for the current ticket'),
  async execute(interaction) {
    const ticketChannel = interaction.channel;
    const ticketId = ticketChannel.name.split('-')[1];

    try {
      const staffRoles = await TicketStaffRole.findAll({
        where: { guildId: interaction.guild.id },
      });

      const isStaff = staffRoles.some(role => interaction.member.roles.cache.has(role.roleId));

      if (!isStaff) {
        await interaction.reply({
          content: 'You do not have permission to generate ticket reports.',
          ephemeral: true,
        });
        return;
      }

      const ticket = await Ticket.findOne({ where: { id: ticketId } });

      if (!ticket) {
        await interaction.reply({
          content: 'This channel is not a valid ticket.',
          ephemeral: true,
        });
        return;
      }

      const transcript = await TicketTranscript.findOne({ where: { ticketId } });

      const embed = new MessageEmbed()
        .setTitle(`Ticket Report - #${ticket.id}`)
        .addField('Creator', `<@${ticket.creatorId}>`)
        .addField('Title', ticket.title)
        .addField('Description', ticket.description)
        .addField('Status', ticket.status)
        .addField('Priority', ticket.priority)
        .addField('Created At', ticket.createdAt)
        .addField('Closed At', ticket.closedAt || 'N/A')
        .setColor('#0099ff');

      if (transcript) {
        embed.addField('Transcript', `\`\`\`${transcript.transcript}\`\`\``);
      }

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error('Error generating ticket report:', error);
      await interaction.reply({
        content: 'An error occurred while generating the ticket report.',
        ephemeral: true,
      });
    }
  },
};