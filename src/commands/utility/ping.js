const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: 'ping',
  description: 'Responds with "Pong!" and shows the latency',
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responds with "Pong!" and shows the latency')
    .addStringOption(option =>
      option.setName('help')
        .setDescription('Get detailed information about the ping command')
        .setRequired(false)
        .addChoices(
          { name: 'Usage', value: 'usage' },
          { name: 'Examples', value: 'examples' },
          { name: 'Cooldown', value: 'cooldown' }
        )),
  async execute(interaction) {
    const helpOption = interaction.options.getString('help');

    if (helpOption) {
      let helpMessage = '';

      switch (helpOption) {
        case 'usage':
          helpMessage = 'To use the ping command, simply type `!ping` or `/ping` in the chat.';
          break;
        case 'examples':
          helpMessage = 'Examples:\n- `!ping`\n- `/ping`\n- `/ping help: usage`';
          break;
        case 'cooldown':
          helpMessage = 'The ping command has a cooldown of 5 seconds between each usage.';
          break;
      }

      await interaction.reply({ content: helpMessage, ephemeral: true });
    } else {
      const latency = interaction.client.ws.ping;
      await interaction.reply(`Pong! Latency: ${latency}ms`);
    }
  },
};
