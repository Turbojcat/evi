const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removetimeout')
    .setDescription('Removes timeout from a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to remove timeout from')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
      const member = await interaction.guild.members.fetch(user.id);
      await member.timeout(null);
      await interaction.reply(`Removed timeout from user ${user.tag}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to remove timeout from the user. Please check my permissions and try again.');
    }
  },
};
