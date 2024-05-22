const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Shows warnings for a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to show warnings for')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
      // Hent advarslene for brukeren fra databasen
      // Eksempel: const warnings = await Warning.findAll({ where: { userId: user.id } });

      // Formater advarslene som en melding eller embed
      const warningsList = warnings.map((warning, index) => `${index + 1}. ${warning.reason}`).join('\n');

      const embed = {
        color: 0xffff00,
        title: `Warnings for ${user.tag}`,
        description: warningsList || 'No warnings found.',
        timestamp: new Date(),
      };

      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching warnings:', error);
      await interaction.reply('An error occurred while fetching warnings. Please try again later.');
    }
  },
};
