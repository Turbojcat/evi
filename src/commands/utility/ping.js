// /home/user/projects/evi/src/commands/utility/ping.js
module.exports = {
    name: 'ping',
    description: 'Checks the bot\'s latency.',
    execute(message) {
      message.reply(`Pong! Latency: ${Math.round(message.client.ws.ping)}ms`);
    },
  };
  