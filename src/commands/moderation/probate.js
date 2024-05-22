const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('probate')
    .setDescription('Puts a user on probation')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to put on probation')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('The duration of the probation in days')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration');

    try {
      const probationRole = interaction.guild.roles.cache.find(role => role.name === 'Probation');

      if (!probationRole) {
        await interaction.reply('The "Probation" role does not exist on this server. Please create it and try again.');
        return;
      }

      const member = await interaction.guild.members.fetch(user.id);
      await member.roles.add(probationRole);

      setTimeout(async () => {
        await member.roles.remove(probationRole);
      }, duration * 24 * 60 * 60 * 1000);

      await interaction.reply(`Put user ${user.tag} on probation for ${duration} days.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to put the user on probation. Please check my permissions and try again.');
    }
  },
};
