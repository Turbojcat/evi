const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Adds a role to a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to add the role to')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to add to the user')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');

    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.roles.add(role);
      await interaction.reply(`Added role ${role.name} to user ${user.tag}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to add the role to the user. Please check my permissions and try again.');
    }
  },
};
