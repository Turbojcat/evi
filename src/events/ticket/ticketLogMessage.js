// src/events/ticket/ticketLogMessage.js
const { MessageEmbed } = require('discord.js');
const { TicketLog } = require('../../database/database');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    const ticketChannel = message.channel;
    const ticketId = ticketChannel.name.split('-')[1];

    try {
      const ticketLog = await TicketLog.findOne({
        where: { guildId: message.guild.id },
      });

      if (ticketLog) {
        const logChannel = message.guild.channels.cache.get(ticketLog.channelId);

        if (logChannel) {
          const embed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL())
            .setDescription(message.content)
            .setFooter(`Ticket ID: ${ticketId}`)
            .setTimestamp();

          await logChannel.send({ embeds: [embed] });
        }
      }
    } catch (error) {
      console.error('Error logging ticket message:', error);
    }
  },
};