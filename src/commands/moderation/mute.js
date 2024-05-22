const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Mutes a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to mute')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the mute')),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.MODERATE_MEMBERS)) {
      return interaction.reply({ content: 'You do not have permission to mute members.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      const mutedRole = interaction.guild.roles.cache.find(role => role.name === 'Muted');
      if (!mutedRole) {
        return interaction.reply({ content: 'There is no "Muted" role on this server.', ephemeral: true });
      }

      await interaction.guild.members.cache.get(user.id).roles.add(mutedRole, reason);
      await interaction.reply(`Successfully muted ${user.tag}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to mute the user.', ephemeral: true });
    }
  },
};
