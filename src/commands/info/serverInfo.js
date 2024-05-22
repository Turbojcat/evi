const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('Displays server information')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
    .setDMPermission(false),
  async execute(interaction) {
    const guild = interaction.guild;

    const serverInfo = `
      Server Name: ${guild.name}
      Server ID: ${guild.id}
      Owner: ${guild.owner.user.tag}
      Created At: ${guild.createdAt}
      Member Count: ${guild.memberCount}
      Role Count: ${guild.roles.cache.size}
      Channel Count: ${guild.channels.cache.size}
    `;

    await interaction.reply(serverInfo);
  },
};
