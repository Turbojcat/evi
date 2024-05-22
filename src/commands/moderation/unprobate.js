const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unprobate')
    .setDescription('Removes a user from probation')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to remove from probation')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
      const probationRole = interaction.guild.roles.cache.find(role => role.name === 'Probation');

      if (!probationRole) {
        await interaction.reply('The "Probation" role does not exist on this server.');
        return;
      }

      const member = await interaction.guild.members.fetch(user.id);
      await member.roles.remove(probationRole);

      await interaction.reply(`Removed user ${user.tag} from probation.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to remove the user from probation. Please check my permissions and try again.');
    }
  },
};
