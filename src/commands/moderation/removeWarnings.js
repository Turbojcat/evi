const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { Warnings } = require('../../database/models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removewarning')
    .setDescription('Removes a warning from a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to remove a warning from')
        .setRequired(true)),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.MODERATE_MEMBERS)) {
      return interaction.reply({ content: 'You do not have permission to remove warnings.', ephemeral: true });
    }

    const user = interaction.options.getUser('user');

    try {
      const warning = await Warnings.findOne({
        where: { userId: user.id, guildId: interaction.guild.id },
      });

      if (!warning) {
        await interaction.reply(`${user.tag} has no warnings to remove.`);
      } else {
        await warning.decrement('count');
        await interaction.reply(`Removed a warning from ${user.tag}. They now have ${warning.count} warning(s).`);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error removing the warning.', ephemeral: true });
    }
  },
};
