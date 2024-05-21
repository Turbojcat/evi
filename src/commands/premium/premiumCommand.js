const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('premiumcommand')
    .setDescription('A premium command'),
  premium: true,
  async execute(interaction) {
    // Kommandologikk for premium-brukere
  },
};