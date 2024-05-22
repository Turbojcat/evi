const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removerole')
    .setDescription('Removes a role from a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to remove the role from')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The role to remove from the user')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const role = interaction.options.getRole('role');

    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.roles.remove(role);
      await interaction.reply(`Removed role ${role.name} from user ${user.tag}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to remove the role from the user. Please check my permissions and try again.');
    }
  },
};
