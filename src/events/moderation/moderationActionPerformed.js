const { ModLogChannel } = require('../../database/database');

module.exports = {
  name: 'moderationActionPerformed',
  async execute(action, moderator, target, reason) {
    try {
      const modLogChannel = await ModLogChannel.findOne({
        where: { guildId: moderator.guild.id },
      });

      if (modLogChannel) {
        const channel = moderator.guild.channels.cache.get(modLogChannel.channelId);

        if (channel) {
          const embed = {
            color: 0xff0000,
            title: `Moderation Action: ${action}`,
            fields: [
              {
                name: 'Moderator',
                value: `${moderator.user.tag} (${moderator.id})`,
              },
              {
                name: 'Target',
                value: `${target.user.tag} (${target.id})`,
              },
              {
                name: 'Reason',
                value: reason || 'No reason provided',
              },
            ],
            timestamp: new Date(),
          };

          await channel.send({ embeds: [embed] });
        }
      }
    } catch (error) {
      console.error('Error logging moderation action:', error);
    }
  },
};
