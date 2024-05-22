const { loadTicketCategory } = require('../../commands/ticket/ticketcategory');
const { syncDatabase } = require('../database/database');

module.exports = {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    // Load the ticket category from the JSON file
    const ticketCategory = await loadTicketCategory();
    if (ticketCategory) {
      console.log('Loaded ticket category from file:', ticketCategory);
      // Perform any necessary actions with the loaded ticket category
    }
    // Sync the database models with the database
    await syncDatabase();
    console.log('Database synced');
    
    // Set the client user's presence
    client.user.setPresence({ activities: [{ name: 'Evi Alpha DEV Mode!' }], status: 'online' });
  },
};