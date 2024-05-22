const { PREFIX } = require('../../config');
const { ModAlertChannel } = require('../../database/database');

module.exports = {
  name: 'messageCreate',
  async execute(message) {
    if (message.author.bot) return;

    // Sjekk meldingen mot definerte kriterier for potensielle regelbrudd
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

    // Håndter prefix-kommandoer
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
  // Implementer logikken for å sjekke meldingsinnholdet mot definerte kriterier
  // Returner true hvis en overtredelse oppdages, ellers false
  // Dette kan inkludere søk etter upassende språk, lenker, etc.
  // Du kan også integrere med eksterne APIer for innholdsmoderering
}
