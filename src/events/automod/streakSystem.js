const { sequelize, DataTypes } = require('../../database/database');
const Warnings = require('../../database/models/Warnings')(sequelize, DataTypes);
const ModSettings = require('../../database/models/ModSettings')(sequelize, DataTypes);



module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    try {
      const guildId = message.guild.id;
      const settings = await ModSettings.findOne({ where: { guildId } });
      const streakThreshold = settings ? settings.streakThreshold : 3;
      const streakAction = settings ? settings.streakAction : 'ban';

      const warning = await Warnings.findOne({
        where: { userId: message.author.id, guildId },
      });

      if (warning && warning.count >= streakThreshold) {
        if (streakAction === 'ban') {
          await message.guild.members.ban(message.author, { reason: 'Reached warning streak threshold' });
          await message.channel.send(`${message.author} has been banned for reaching the warning streak threshold.`);
        } else if (streakAction === 'kick') {
          await message.guild.members.kick(message.author, 'Reached warning streak threshold');
          await message.channel.send(`${message.author} has been kicked for reaching the warning streak threshold.`);
        }
      }
    } catch (error) {
      console.error(error);
    }
  },
};
