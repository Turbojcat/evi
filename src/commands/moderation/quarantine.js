const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('quarantine')
    .setDescription('Quarantines a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to quarantine')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
      const quarantineRole = interaction.guild.roles.cache.find(role => role.name === 'Quarantine');

      if (!quarantineRole) {
        await interaction.reply('The "Quarantine" role does not exist on this server. Please create it and try again.');
        return;
      }

      const member = await interaction.guild.members.fetch(user.id);
      await member.roles.add(quarantineRole);
      await interaction.reply(`Quarantined user ${user.tag}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to quarantine the user. Please check my permissions and try again.');
    }
  },
};
