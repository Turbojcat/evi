const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Unbans a user from the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to unban')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.BAN_MEMBERS)) {
      return interaction.reply({ content: 'You do not have permission to unban members.', ephemeral: true });
    }

    const userId = interaction.options.getUser('user').id;

    try {
      await interaction.guild.members.unban(userId);
      await interaction.reply(`Successfully unbanned user with ID ${userId} from the server.`);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error trying to unban the user.', ephemeral: true });
    }
  },
};
