// src/commands/utility/register.js
const { User } = require('../../database/models');

module.exports = {
  name: 'register',
  description: 'Registrer en ny bruker',
  async execute(message, args) {
    const name = args[0];
    const email = args[1];

    try {
      const user = await User.create({ name, email });
      message.reply(`Bruker registrert med ID: ${user.id}`);
    } catch (error) {
      console.error('Feil ved registrering av bruker:', error);
      message.reply('Det oppstod en feil ved registrering av brukeren.');
    }
  },
};
