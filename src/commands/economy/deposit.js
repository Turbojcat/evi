// src/commands/economy/deposit.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUserBalance, updateUserBalance } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deposit')
    .setDescription('Deposit Evi :coin: from your wallet to your bank')
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of Evi :coin: to deposit')
        .setRequired(true)
    ),
  aliases: ['dep'],
  async execute(interaction) {
    const amount = interaction.options.getInteger('amount');

    try {
      const balance = await getUserBalance(interaction.user.id);

      if (amount <= 0) {
        await interaction.reply({
          content: 'Deposit amount must be greater than zero.',
          ephemeral: true,
        });
        return;
      }

      if (balance.wallet < amount) {
        await interaction.reply({
          content: 'Insufficient Evi :coin: in your wallet.',
          ephemeral: true,
        });
        return;
      }

      await updateUserBalance(interaction.user.id, -amount, 'wallet');
      await updateUserBalance(interaction.user.id, amount, 'bank');

      const updatedBalance = await getUserBalance(interaction.user.id);

      const depositEmbed = {
        color: 0x00ff00,
        title: 'Deposit Successful',
        description: `You have successfully deposited ${amount} Evi :coin: from your wallet to your bank.`,
        fields: [
          {
            name: 'Updated Wallet Balance',
            value: `${updatedBalance.wallet} Evi :coin:`,
            inline: true,
          },
          {
            name: 'Updated Bank Balance',
            value: `${updatedBalance.bank} Evi :coin:`,
            inline: true,
          },
        ],
        timestamp: new Date(),
      };

      await interaction.reply({ embeds: [depositEmbed] });
    } catch (error) {
      logger.error('Failed to execute deposit command:', error);
      await interaction.reply({
        content: 'An error occurred while depositing Evi :coin:.',
        ephemeral: true,
      });
    }
  },
};
