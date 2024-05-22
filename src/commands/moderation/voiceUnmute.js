const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('voiceunmute')
    .setDescription('Voice unmutes a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to voice unmute')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.voice.setMute(false);

      await interaction.reply(`Voice unmuted user ${user.tag}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to voice unmute the user. Please check my permissions and try again.');
    }
  },
};
