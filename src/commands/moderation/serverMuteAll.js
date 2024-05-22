const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('servermuteall')
    .setDescription('Mutes a user in all channels')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to mute in all channels')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('The duration of the mute in minutes')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration');

    try {
      const member = await interaction.guild.members.fetch(user.id);

      await member.timeout(duration * 60 * 1000);

      await interaction.reply(`Muted user ${user.tag} in all channels for ${duration} minutes.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to mute the user in all channels. Please check my permissions and try again.');
    }
  },
};
