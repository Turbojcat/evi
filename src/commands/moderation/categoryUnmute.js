const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('categoryunmute')
    .setDescription('Unmutes a user in a specific category')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to unmute in the category')
        .setRequired(true))
    .addChannelOption(option =>
      option.setName('category')
        .setDescription('The category to unmute the user in')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const category = interaction.options.getChannel('category');

    try {
      if (category.type !== 'GUILD_CATEGORY') {
        await interaction.reply('Please provide a valid category.');
        return;
      }

      const channels = category.children.filter(channel => channel.type === 'GUILD_TEXT');

      for (const channel of channels) {
        await channel.permissionOverwrites.delete(user);
      }

      await interaction.reply(`Unmuted user ${user.tag} in category ${category.name}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to unmute the user in the category. Please check my permissions and try again.');
    }
  },
};
