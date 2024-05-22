const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('servervoicemute')
    .setDescription('Mutes a user in all voice channels')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to mute in all voice channels')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('The duration of the mute in minutes')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration');

    try {
      const member = await interaction.guild.members.fetch(user.id);
      const voiceChannel = member.voice.channel;

      if (voiceChannel) {
        await member.voice.setMute(true);
      }

      setTimeout(async () => {
        if (voiceChannel) {
          await member.voice.setMute(false);
        }
      }, duration * 60 * 1000);

      await interaction.reply(`Muted user ${user.tag} in all voice channels for ${duration} minutes.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to mute the user in all voice channels. Please check my permissions and try again.');
    }
  },
};
