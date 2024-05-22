const { Warnings } = require('../../database/models');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    // Check for forbidden words or other rule violations
    // ...

    try {
      const [warning, created] = await Warnings.findOrCreate({
        where: { userId: message.author.id, guildId: message.guild.id },
        defaults: { count: 1 },
      });

      if (!created) {
        await warning.increment('count');
      }

      await message.channel.send(`${message.author}, you have been warned. Warning count: ${warning.count}`);
      // Implement streak system logic here
    } catch (error) {
      console.error(error);
    }
  },
};
