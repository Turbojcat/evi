//const { updatePresence } = require('../../utils/presenceUpdater');
module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`Ready! Logged in as ${client.user.tag}`);

    // Set the client user's presence
    client.user.setPresence({ activities: [{ name: 'Alpha sil in DEV Mode!' }], status: 'online' });

    // You can add any other initialization or setup code for your bot here
  },
};
