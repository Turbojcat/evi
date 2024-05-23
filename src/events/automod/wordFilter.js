const { Warnings, ModSettings } = require('../../database/models');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    const guildId = message.guild.id;
    const settings = await ModSettings.findOne({ where: { guildId } });
    const forbiddenWords = settings ? settings.forbiddenWords : [];

    const content = message.content.toLowerCase();
    const hasForbiddenWord = forbiddenWords.some(word => content.includes(word.toLowerCase()));

    if (hasForbiddenWord) {
      await message.delete();
      await message.channel.send(`${message.author}, your message contained a forbidden word and has been deleted.`);
      // Implement warning system logic here
    }
  },
};
