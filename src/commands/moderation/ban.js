const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const ms = require('ms');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Bans a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to ban')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('duration')
        .setDescription('The duration of the ban (e.g., 1s, 2m, 3h, 4d, 5y)'))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the ban')),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.BAN_MEMBERS)) {
      return interaction.reply({ content: 'You do not have permission to ban members.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');
    const duration = interaction.options.getString('duration');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      if (duration) {
        const banDuration = ms(duration);
        await interaction.guild.members.ban(user, { reason, days: banDuration / 86400000 });
        await interaction.reply(`Successfully banned ${user.tag} from the server for ${duration}.`);
      } else {
        await interaction.guild.members.ban(user, { reason });
        await interaction.reply(`Successfully banned ${user.tag} from the server permanently.`);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to ban the user.', ephemeral: true });
    }
  },
};
