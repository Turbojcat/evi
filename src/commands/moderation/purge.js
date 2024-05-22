const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('purge')
    .setDescription('Purges messages in a channel')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The number of messages to purge')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false),
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    try {
      const messages = await interaction.channel.messages.fetch({ limit: amount });
      await interaction.channel.bulkDelete(messages);
      await interaction.reply(`Purged ${amount} messages in this channel.`);
    } catch (error) {
      console.error(error);
      await interaction.reply('Failed to purge messages. Please check my permissions and try again.');
    }
  },
};
