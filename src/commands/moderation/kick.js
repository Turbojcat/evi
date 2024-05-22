const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Kicks a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to kick')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the kick')),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.KICK_MEMBERS)) {
      return interaction.reply({ content: 'You do not have permission to kick members.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      await interaction.guild.members.kick(user, reason);
      await interaction.reply(`Successfully kicked ${user.tag} from the server.`);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to kick the user.', ephemeral: true });
    }
  },
};
