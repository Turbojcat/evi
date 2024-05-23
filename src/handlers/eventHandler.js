const fs = require('fs');
const path = require('path');
const { ModAction } = require('../database/database.js');

async function loadEvents(client) {
  const eventFolders = fs.readdirSync(path.join(__dirname, '..', 'events'));

  for (const folder of eventFolders) {
    const eventFiles = fs.readdirSync(path.join(__dirname, '..', 'events', folder)).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
      const event = require(path.join(__dirname, '..', 'events', folder, file));
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }
  }

  try {
    await ModAction.sync();
    console.log('ModAction model synced');
  } catch (error) {
    console.error('Failed to sync ModAction model:', error);
  }

  console.log('Events loaded');
}

module.exports = {
  loadEvents,
};
