// src/events/messages/messageCreate.js
const AutoResponse = require('../../database/models/AutoResponse');
const { PREFIX } = require('../../config');
const { ModAlertChannel } = require('../../database/database');
const { replacePlaceholders } = require('../../utils/placeholders');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    // Check the message against defined criteria for potential rule violations
    const violationDetected = checkForViolation(message.content);

    if (violationDetected) {
      try {
        const modAlertChannel = await ModAlertChannel.findOne({
          where: { guildId: message.guild.id },
        });

        if (modAlertChannel) {
          const channel = message.guild.channels.cache.get(modAlertChannel.channelId);

          if (channel) {
            const embed = {
              color: 0xff0000,
              title: 'Potential Rule Violation',
              description: `A potential rule violation has been detected in ${message.channel}.`,
              fields: [
                {
                  name: 'User',
                  value: `${message.author.tag} (${message.author.id})`,
                },
                {
                  name: 'Message Content',
                  value: message.content,
                },
              ],
              timestamp: new Date(),
            };

            await channel.send({ embeds: [embed] });
          }
        }
      } catch (error) {
        console.error('Error sending moderation alert:', error);
      }
    }

    // Handle auto-responses
    const autoResponses = await AutoResponse.findAll();

    for (const autoResponse of autoResponses) {
      if (message.content.toLowerCase().includes(autoResponse.trigger.toLowerCase())) {
        const processedResponse = await replacePlaceholders(autoResponse.response, message);
        message.channel.send(autoResponse.response);
      }
    }

    // Handle prefix commands
    if (!message.content.startsWith(PREFIX)) return;

    const args = message.content.slice(PREFIX.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = message.client.commands.get(commandName);

    if (!command) return;

    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(error);
      await message.reply('There was an error while executing this command!');
    }
  },
};

function checkForViolation(content) {
  // Implement the logic to check the message content against defined criteria
  // Return true if a violation is detected, otherwise false
  // This can include searching for inappropriate language, links, etc.
  // You can also integrate with external APIs for content moderation
}
