// src/commands/economy/withdraw.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUserBalance, updateUserBalance } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('withdraw')
    .setDescription('Withdraw Evi :coin: from your bank to your wallet')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of Evi :coin: to withdraw')
        .setRequired(true)
    ),
  aliases: ['wd'],
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    try {
      const balance = await getUserBalance(interaction.user.id);

      if (amount <= 0) {
        await interaction.reply({
          content: 'Withdrawal amount must be greater than zero.',
          ephemeral: true,
        });
        return;
      }

      if (balance.bank < amount) {
        await interaction.reply({
          content: 'Insufficient Evi :coin: in your bank.',
          ephemeral: true,
        });
        return;
      }

      await updateUserBalance(interaction.user.id, -amount, 'bank');
      await updateUserBalance(interaction.user.id, amount, 'wallet');

      const updatedBalance = await getUserBalance(interaction.user.id);

      const withdrawEmbed = {
        color: 0x00ff00,
        title: 'Withdrawal Successful',
        description: `You have successfully withdrawn ${amount} Evi :coin: from your bank to your wallet.`,
        fields: [
          {
            name: 'Updated Bank Balance',
            value: `${updatedBalance.bank} Evi :coin:`,
            inline: true,
          },
          {
            name: 'Updated Wallet Balance',
            value: `${updatedBalance.wallet} Evi :coin:`,
            inline: true,
          },
        ],
        timestamp: new Date(),
      };

      await interaction.reply({ embeds: [withdrawEmbed] });
    } catch (error) {
      logger.error('Failed to execute withdraw command:', error);
      await interaction.reply({
        content: 'An error occurred while withdrawing Evi :coin:.',
        ephemeral: true,
      });
    }
  },
};
