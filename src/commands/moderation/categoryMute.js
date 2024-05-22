const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('categorymute')
    .setDescription('Mutes a user in a specific category')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to mute in the category')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('category')
        .setDescription('The category to mute the user in')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('The duration of the mute in minutes')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const category = interaction.options.getChannel('category');
    const duration = interaction.options.getInteger('duration');

    try {
      if (category.type !== 'GUILD_CATEGORY') {
        await interaction.reply('Please provide a valid category.');
        return;
      }

      const channels = category.children.filter(channel => channel.type === 'GUILD_TEXT');

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

      await interaction.reply(`Muted user ${user.tag} in category ${category.name} for ${duration} minutes.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to mute the user in the category. Please check my permissions and try again.');
    }
  },
};
