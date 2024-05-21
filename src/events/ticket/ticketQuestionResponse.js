// src/events/ticket/ticketQuestionResponse.js
const { MessageEmbed } = require('discord.js');
const { TicketResponse, TicketQuestion, Ticket } = require('../../database/database');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    // Check if the message is in a ticket channel
    const ticket = await Ticket.findOne({ where: { channelId: message.channel.id } });
    if (!ticket) return;

    // Check if the message is a response to a ticket question
    const question = await TicketQuestion.findOne({ where: { question: message.content } });
    if (!question) return;

    try {
      // Create a new ticket response
      const ticketResponse = await TicketResponse.create({
        questionId: question.id,
        ticketId: ticket.id,
        response: message.content,
      });

      console.log('Ticket response saved successfully');

      // Fetch all responses for the current ticket
      const responses = await TicketResponse.findAll({
        where: { ticketId: ticket.id },
      });

      // Create an embed to display the ticket responses
      const embed = new MessageEmbed()
        .setTitle('Ticket Responses')
        .setColor('#0099ff');

      responses.forEach((response, index) => {
        const question = TicketQuestion.findByPk(response.questionId);
        embed.addField(`Question ${index + 1}`, question.question);
        embed.addField(`Response ${index + 1}`, response.response);
      });

      // Send the embed to the ticket channel
      await message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error saving ticket response:', error);
    }
  },
};