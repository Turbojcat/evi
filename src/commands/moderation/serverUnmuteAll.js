const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverunmuteall')
    .setDescription('Unmutes a user in all channels')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to unmute in all channels')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
      const member = await interaction.guild.members.fetch(user.id);

      await member.timeout(null);

      await interaction.reply(`Unmuted user ${user.tag} in all channels.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to unmute the user in all channels. Please check my permissions and try again.');
    }
  },
};
