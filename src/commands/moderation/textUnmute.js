const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('textunmute')
    .setDescription('Text unmutes a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to text unmute')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
      const textMuteRole = interaction.guild.roles.cache.find(role => role.name === 'Text Mute');

      if (!textMuteRole) {
        await interaction.reply('The "Text Mute" role does not exist on this server.');
        return;
      }

      const member = await interaction.guild.members.fetch(user.id);
      await member.roles.remove(textMuteRole);

      await interaction.reply(`Text unmuted user ${user.tag}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to text unmute the user. Please check my permissions and try again.');
    }
  },
};
