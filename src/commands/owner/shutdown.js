// src/commands/owner/shutdown.js
const config = require('../../config');

module.exports = {
  name: 'shutdown',
  description: 'Slår av boten (bare tilgjengelig for boteieren)',
  execute(message) {
    if (message.author.id !== config.OWNER_ID) {
      return message.reply('Du har ikke tillatelse til å utføre denne kommandoen.');
    }

    message.reply('Slår av boten...').then(() => {
      process.exit(0);
    });
  },
};
