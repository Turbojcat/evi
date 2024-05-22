const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { ModAction } = require('../../database/models/ModAction');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Displays the warnings for a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to display warnings for')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    try {
      const warnings = await ModAction.findAll({
        where: {
          action: 'Warn',
          targetId: user.id,
        },
      });

      if (warnings.length === 0) {
        await interaction.reply(`No warnings found for user ${user.tag}.`);
        return;
      }

      const warningList = warnings.map(warn => `ID: ${warn.id} | Reason: ${warn.reason || 'No reason provided'}`).join('\n');
      await interaction.reply(`Warnings for user ${user.tag}:\n${warningList}`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to retrieve warnings. Please try again later.');
    }
  },
};
