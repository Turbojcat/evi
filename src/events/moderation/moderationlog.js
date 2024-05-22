const { MessageEmbed } = require('discord.js');
const { ModAction } = require('../../database/models');
const { ModSettings } = require('../../database/models');

module.exports = {
  name: 'moderationAction',
  async execute(moderator, target, action, reason) {
    const logChannel = moderator.guild.channels.cache.find(channel => channel.name === 'moderation-logs');
    if (!logChannel) return;

    const embed = new MessageEmbed()
      .setColor('#ff0000')
      .setTitle(`Moderation Action: ${action}`)
      .addField('Moderator', moderator.tag)
      .addField('Target', target.tag)
      .addField('Reason', reason || 'No reason provided')
      .setTimestamp();

    await logChannel.send({ embeds: [embed] });
  },
};
