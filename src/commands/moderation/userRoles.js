const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('userroles')
    .setDescription('Displays a user\'s roles')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to display roles for')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
      const member = await interaction.guild.members.fetch(user.id);
      const roles = member.roles.cache.map(role => role.name).join(', ');

      await interaction.reply(`User ${user.tag} has the following roles: ${roles}`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to retrieve the user\'s roles. Please check my permissions and try again.');
    }
  },
};
