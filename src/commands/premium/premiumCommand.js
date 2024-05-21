// src/commands/premium/premiumCommand.js

module.exports = {
    data: new SlashCommandBuilder()
      .setName('premiumcommand')
      .setDescription('A premium command'),
    premium: true,
    async execute(interaction) {
      // Kommandologikk for premium-brukere
    },
  };