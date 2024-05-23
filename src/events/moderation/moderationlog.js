const { MessageEmbed } = require('discord.js');
const { ModAction } = require('../../database/connection');
const { ModSettings } = require('../../database/models/ModSettings');

module.exports = {
  name: 'moderationAction',
  async execute(moderator, target, action, reason) {
    try {
      const settings = await ModSettings.findOne({ where: { guildId: moderator.guild.id } });
      if (!settings || !settings.modLogChannelId) {
        return;
      }

      const logChannelId = settings.modLogChannelId;
      const logChannel = moderator.guild.channels.cache.get(logChannelId);
      if (!logChannel) {
        return;
      }

      const embed = new MessageEmbed()
        .setColor('#ff0000')
        .setTitle(`Moderation Action: ${action}`)
        .addField('Moderator', moderator.tag)
        .addField('Target', target.tag)
        .addField('Reason', reason || 'No reason provided')
        .setTimestamp();

      await logChannel.send({ embeds: [embed] });

      await ModAction.create({
        guildId: moderator.guild.id,
        moderatorId: moderator.id,
        action: action,
        targetId: target.id,
        reason: reason,
      });
    } catch (error) {
      console.error('Failed to log moderation action:', error);
    }
  },
};
