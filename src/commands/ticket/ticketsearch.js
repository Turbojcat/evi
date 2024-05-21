// src/commands/ticket/ticketsearch.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { TicketStaffRole, Ticket } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketsearch')
    .setDescription('Searches for tickets based on user or keyword')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('The user ID or keyword to search for')
        .setRequired(true)
    ),
  async execute(interaction) {
    const query = interaction.options.getString('query');

    try {
      const staffRoles = await TicketStaffRole.findAll({
        where: { guildId: interaction.guild.id },
      });

      const isStaff = staffRoles.some(role => interaction.member.roles.cache.has(role.roleId));

      if (!isStaff) {
        await interaction.reply({
          content: 'You do not have permission to search tickets.',
          ephemeral: true,
        });
        return;
      }

      const tickets = await Ticket.findAll({
        where: {
          [Op.or]: [
            { creatorId: query },
            { title: { [Op.like]: `%${query}%` } },
            { description: { [Op.like]: `%${query}%` } },
          ],
        },
      });

      if (tickets.length === 0) {
        await interaction.reply({
          content: 'No tickets found matching the search query.',
          ephemeral: true,
        });
        return;
      }

      const embed = new MessageEmbed()
        .setTitle('Ticket Search Results')
        .setDescription(`Found ${tickets.length} ticket(s) matching the search query.`)
        .setColor('#0099ff');

      for (const ticket of tickets) {
        const ticketChannel = interaction.guild.channels.cache.find(
          channel => channel.name === `ticket-${ticket.id}`
        );

        if (ticketChannel) {
          embed.addField(
            `Ticket #${ticket.id}`,
            `Creator: <@${ticket.creatorId}>\nTitle: ${ticket.title}\nChannel: ${ticketChannel}`
          );
        }
      }

      await interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (error) {
      console.error('Error searching tickets:', error);
      await interaction.reply({
        content: 'An error occurred while searching tickets.',
        ephemeral: true,
      });
    }
  },
};