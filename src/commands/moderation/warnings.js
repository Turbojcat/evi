const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { Warnings } = require('../../database/models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Displays the warnings for a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to view warnings for')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.MODERATE_MEMBERS)) {
      return interaction.reply({ content: 'You do not have permission to view warnings.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');

    try {
      const warnings = await Warnings.findOne({
        where: { userId: user.id, guildId: interaction.guild.id },
      });

      if (!warnings) {
        await interaction.reply(`${user.tag} has no warnings.`);
      } else {
        await interaction.reply(`${user.tag} has ${warnings.count} warning(s).`);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error fetching the warnings.', ephemeral: true });
    }
  },
};
