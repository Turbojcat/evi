const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: 'ping',
  description: 'Responds with "Pong!" and shows the latency',
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responds with "Pong!" and shows the latency'),
  async execute(interaction) {
    const latency = interaction.client.ws.ping;
    await interaction.reply(`Pong! Latency: ${latency}ms`);
  },
};
