const config = require('../../config');

module.exports = {
  name: 'error',
  data: {},
  execute(error, client) {
    console.error('Botfeil:', error);

    const owner = client.users.cache.get(config.OWNER_ID);
    if (owner) {
      owner.send(`Det oppstod en feil: ${error.message}`);
    }
  },
};