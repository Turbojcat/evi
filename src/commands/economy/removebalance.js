// src/commands/economy/removebalance.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUserBalance, updateUserBalance } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('removebalance')
    .setDescription('Remove Evi :coin: from a user\'s balance')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to remove balance from')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of Evi :coin: to remove')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('type')
        .setDescription('The type of balance to remove from (wallet or bank)')
        .setRequired(true)
        .addChoices(
          { name: 'Wallet', value: 'wallet' },
          { name: 'Bank', value: 'bank' }
        )
    ),
  aliases: ['rb'],
  adminOnly: true,
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    const type = interaction.options.getString('type');

    try {
      const currentBalance = await getUserBalance(user.id);
      const newBalance = type === 'wallet' ? { wallet: currentBalance.wallet - amount, bank: currentBalance.bank }
                                            : { wallet: currentBalance.wallet, bank: currentBalance.bank - amount };

      if (newBalance.wallet < 0 || newBalance.bank < 0) {
        await interaction.reply({
          content: 'Insufficient funds. Cannot remove the specified amount.',
          ephemeral: true,
        });
        return;
      }

      await updateUserBalance(user.id, newBalance.wallet, 'wallet', true);
      await updateUserBalance(user.id, newBalance.bank, 'bank', true);

      const removeBalanceEmbed = {
        color: 0x00ff00,
        title: 'Balance Removed',
        description: `${amount} Evi :coin: has been removed from ${user.username}'s ${type} balance.`,
        fields: [
          {
            name: 'Updated Wallet',
            value: `${newBalance.wallet} Evi :coin:`,
            inline: true,
          },
          {
            name: 'Updated Bank',
            value: `${newBalance.bank} Evi :coin:`,
            inline: true,
          },
        ],
        timestamp: new Date(),
      };

      await interaction.reply({ embeds: [removeBalanceEmbed] });
    } catch (error) {
      logger.error('Failed to execute removebalance command:', error);
      await interaction.reply({
        content: 'An error occurred while removing balance.',
        ephemeral: true,
      });
    }
  },
};
