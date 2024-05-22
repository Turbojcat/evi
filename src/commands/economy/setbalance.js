// src/commands/economy/setbalance.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { getUserBalance, updateUserBalance } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setbalance')
    .setDescription('Set the balance of a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to set the balance of')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('amount')
        .setDescription('The amount of Evi :coin: to set')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('type')
        .setDescription('The type of balance to set (wallet or bank)')
        .setRequired(true)
        .addChoices(
          { name: 'Wallet', value: 'wallet' },
          { name: 'Bank', value: 'bank' }
        )
    ),
  aliases: ['sb'],
  adminOnly: true,
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const amount = interaction.options.getInteger('amount');
    const type = interaction.options.getString('type');

    try {
      const currentBalance = await getUserBalance(user.id);
      const newBalance = type === 'wallet' ? { wallet: amount, bank: currentBalance.bank }
                                            : { wallet: currentBalance.wallet, bank: amount };

      await updateUserBalance(user.id, newBalance.wallet, 'wallet', true);
      await updateUserBalance(user.id, newBalance.bank, 'bank', true);

      const setBalanceEmbed = {
        color: 0x00ff00,
        title: 'Balance Set',
        description: `The ${type} balance of ${user.username} has been set to ${amount} Evi :coin:.`,
        fields: [
          {
            name: 'Wallet',
            value: `${newBalance.wallet} Evi :coin:`,
            inline: true,
          },
          {
            name: 'Bank',
            value: `${newBalance.bank} Evi :coin:`,
            inline: true,
          },
        ],
        timestamp: new Date(),
      };

      await interaction.reply({ embeds: [setBalanceEmbed] });
    } catch (error) {
      logger.error('Failed to execute setbalance command:', error);
      await interaction.reply({
        content: 'An error occurred while setting the balance.',
        ephemeral: true,
      });
    }
  },
};
