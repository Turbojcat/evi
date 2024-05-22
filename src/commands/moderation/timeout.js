const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('timeout')
    .setDescription('Applies a timeout to a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to timeout')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('The duration of the timeout (e.g., 1s, 2m, 3h, 4d, 5y)')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the timeout')),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.MODERATE_MEMBERS)) {
      return interaction.reply({ content: 'You do not have permission to timeout members.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      const timeoutDuration = ms(duration);
      await interaction.guild.members.cache.get(user.id).timeout(timeoutDuration, reason);
      await interaction.reply(`Successfully applied a timeout to ${user.tag} for ${duration}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to timeout the user.', ephemeral: true });
    }
  },
};
