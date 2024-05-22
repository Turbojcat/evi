const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('textmute')
    .setDescription('Text mutes a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to text mute')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('duration')
        .setDescription('The duration of the text mute in minutes')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const duration = interaction.options.getInteger('duration');

    try {
      const textMuteRole = interaction.guild.roles.cache.find(role => role.name === 'Text Mute');

      if (!textMuteRole) {
        await interaction.reply('The "Text Mute" role does not exist on this server. Please create it and try again.');
        return;
      }

      const member = await interaction.guild.members.fetch(user.id);
      await member.roles.add(textMuteRole);

      setTimeout(async () => {
        await member.roles.remove(textMuteRole);
      }, duration * 60 * 1000);

      await interaction.reply(`Text muted user ${user.tag} for ${duration} minutes.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to text mute the user. Please check my permissions and try again.');
    }
  },
};
