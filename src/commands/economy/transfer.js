// src/commands/economy/transfer.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { transferMoney } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('transfer')
    .setDescription('Transfer Evi :coin: from your wallet to another user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to transfer Evi :coin: to')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of Evi :coin: to transfer')
        .setRequired(true)
    ),
  aliases: ['give', 'pay'],
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');

    try {
      if (user.id === interaction.user.id) {
        await interaction.reply({
          content: 'You cannot transfer Evi :coin: to yourself.',
          ephemeral: true,
        });
        return;
      }

      await transferMoney(interaction.user.id, user.id, amount);

      const transferEmbed = {
        color: 0x00ff00,
        title: 'Transfer Successful',
        description: `You have successfully transferred ${amount} Evi :coin: from your wallet to ${user.username}'s wallet.`,
        fields: [
          {
            name: 'Sender',
            value: interaction.user.username,
            inline: true,
          },
          {
            name: 'Receiver',
            value: user.username,
            inline: true,
          },
          {
            name: 'Amount',
            value: `${amount} Evi :coin:`,
            inline: false,
          },
        ],
        timestamp: new Date(),
      };

      await interaction.reply({ embeds: [transferEmbed] });
    } catch (error) {
      logger.error('Failed to execute transfer command:', error);
      await interaction.reply({
        content: 'An error occurred while transferring Evi :coin:.',
        ephemeral: true,
      });
    }
  },
};
