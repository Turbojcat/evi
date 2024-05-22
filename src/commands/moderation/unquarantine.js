const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unquarantine')
    .setDescription('Unquarantines a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to unquarantine')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
      const quarantineRole = interaction.guild.roles.cache.find(role => role.name === 'Quarantine');

      if (!quarantineRole) {
        await interaction.reply('The "Quarantine" role does not exist on this server.');
        return;
      }

      const member = await interaction.guild.members.fetch(user.id);
      await member.roles.remove(quarantineRole);
      await interaction.reply(`Unquarantined user ${user.tag}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to unquarantine the user. Please check my permissions and try again.');
    }
  },
};
