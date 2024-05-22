const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('servermute')
    .setDescription('Mutes a user in all text channels')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to mute in all text channels')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('The duration of the mute in minutes')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration');

    try {
      const channels = interaction.guild.channels.cache.filter(channel => channel.type === 'GUILD_TEXT');

      for (const channel of channels) {
        await channel.permissionOverwrites.create(user, {
          SEND_MESSAGES: false,
        });
      }

      setTimeout(async () => {
        for (const channel of channels) {
          await channel.permissionOverwrites.delete(user);
        }
      }, duration * 60 * 1000);

      await interaction.reply(`Muted user ${user.tag} in all text channels for ${duration} minutes.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to mute the user in all text channels. Please check my permissions and try again.');
    }
  },
};
