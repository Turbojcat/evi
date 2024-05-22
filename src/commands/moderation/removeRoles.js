const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removeroles')
    .setDescription('Removes all roles from a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to remove roles from')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.roles.set([]);
      await interaction.reply(`Removed all roles from user ${user.tag}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to remove roles from the user. Please check my permissions and try again.');
    }
  },
};
