// src/events/ticket/ticketTranscriptDelete.js
const { TicketTranscript } = require('../../database/database');

module.exports = {
  name: 'ready',
  async execute(client) {
    try {
      const transcripts = await TicketTranscript.findAll();

      for (const transcript of transcripts) {
        const createdAt = new Date(transcript.createdAt);
        const expirationDate = new Date(createdAt.getTime() + 30 * 24 * 60 * 60 * 1000);

        if (expirationDate <= new Date()) {
          await transcript.destroy();
        }
      }

      console.log('Expired ticket transcripts deleted successfully.');
    } catch (error) {
      console.error('Error deleting expired ticket transcripts:', error);
    }
  },
};