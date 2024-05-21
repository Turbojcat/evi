// src/events/ticket/ticketQuestionResponse.js
const { MessageEmbed } = require('discord.js');
const { TicketResponse } = require('../../database/database');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    const ticketChannel = message.channel;
    const ticketId = ticketChannel.name.split('-')[1];

    try {
      await TicketResponse.create({
        ticketId,
        questionId: 0, // Assuming a single response for now
        response: message.content,
      });

      const responses = await TicketResponse.findAll({
        where: { ticketId },
      });

      if (responses.length === 1) {
        const embed = new MessageEmbed()
          .setTitle('Ticket Responses')
          .setColor('#0099ff');

        responses.forEach((response, index) => {
          embed.addField(`Question ${index + 1}`, response.response);
        });

        await ticketChannel.send({ embeds: [embed] });
      }
    } catch (error) {
      console.error('Error saving ticket response:', error);
    }
  },
};