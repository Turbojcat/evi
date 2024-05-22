// src/commands/economy/addbalance.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUserBalance, updateUserBalance } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('addbalance')
    .setDescription('Add Evi :coin: to a user\'s balance')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to add balance to')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of Evi :coin: to add')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('type')
        .setDescription('The type of balance to add to (wallet or bank)')
        .setRequired(true)
        .addChoices(
          { name: 'Wallet', value: 'wallet' },
          { name: 'Bank', value: 'bank' }
        )
    ),
  aliases: ['ab'],
  adminOnly: true,
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    const type = interaction.options.getString('type');

    try {
      const currentBalance = await getUserBalance(user.id);
      const newBalance = type === 'wallet' ? { wallet: currentBalance.wallet + amount, bank: currentBalance.bank }
                                            : { wallet: currentBalance.wallet, bank: currentBalance.bank + amount };

      await updateUserBalance(user.id, newBalance.wallet, 'wallet', true);
      await updateUserBalance(user.id, newBalance.bank, 'bank', true);

      const addBalanceEmbed = {
        color: 0x00ff00,
        title: 'Balance Added',
        description: `${amount} Evi :coin: has been added to ${user.username}'s ${type} balance.`,
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

      await interaction.reply({ embeds: [addBalanceEmbed] });
    } catch (error) {
      logger.error('Failed to execute addbalance command:', error);
      await interaction.reply({
        content: 'An error occurred while adding balance.',
        ephemeral: true,
      });
    }
  },
};
