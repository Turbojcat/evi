const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverunmute')
    .setDescription('Unmutes a user in all text channels')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to unmute in all text channels')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
      const channels = interaction.guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT');

      for (const channel of channels) {
        await channel.permissionOverwrites.delete(user);
      }

      await interaction.reply(`Unmuted user ${user.tag} in all text channels.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to unmute the user in all text channels. Please check my permissions and try again.');
    }
  },
};
