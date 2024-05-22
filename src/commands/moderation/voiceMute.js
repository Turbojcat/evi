const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('voicemute')
    .setDescription('Voice mutes a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to voice mute')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('The duration of the voice mute in minutes')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration');

    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.voice.setMute(true);

      setTimeout(async () => {
        await member.voice.setMute(false);
      }, duration * 60 * 1000);

      await interaction.reply(`Voice muted user ${user.tag} for ${duration} minutes.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to voice mute the user. Please check my permissions and try again.');
    }
  },
};
