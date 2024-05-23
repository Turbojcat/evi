const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { ModAction } = require('../../database/database.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removewarn')
    .setDescription('Removes a warning from a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to remove the warning from')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('warn_id')
        .setDescription('The ID of the warning to remove')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const warnId = interaction.options.getString('warn_id');

    try {
      const warn = await ModAction.findOne({
        where: {
          id: warnId,
          action: 'Warn',
          targetId: user.id,
        },
      });

      if (!warn) {
        await interaction.reply(`No warning found with ID ${warnId} for user ${user.tag}.`);
        return;
      }

      await warn.destroy();
      await interaction.reply(`Removed warning with ID ${warnId} from user ${user.tag}.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to remove the warning. Please check the provided warn ID and try again.');
    }
  },
};
