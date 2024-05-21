// src/events/ticket/ticketInactivityReminder.js
const { Ticket } = require('../../database/database');
const { Op } = require('sequelize');

module.exports = {
  name: 'ready',
  async execute(client) {
    setInterval(async () => {
      const inactiveTickets = await Ticket.findAll({
        where: {
          status: 'open',
          updatedAt: {
            [Op.lt]: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
          },
        },
      });

      for (const ticket of inactiveTickets) {
        const ticketChannel = client.channels.cache.find(
          channel => channel.name === `ticket-${ticket.id}`
        );

        if (ticketChannel) {
          await ticketChannel.send('This ticket has been inactive for 24 hours. Please update or close the ticket.');
        }
      }
    }, 60 * 60 * 1000); // Run every hour
  },
};