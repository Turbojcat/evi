const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userpermissions')
    .setDescription('Displays a user\'s permissions')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to display permissions for')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
      const member = await interaction.guild.members.fetch(user.id);
      const permissions = member.permissions.toArray().join(', ');

      await interaction.reply(`User ${user.tag} has the following permissions: ${permissions}`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to retrieve the user\'s permissions. Please check my permissions and try again.');
    }
  },
};
