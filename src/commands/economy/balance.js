// src/commands/economy/balance.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const { getUserBalance } = require('../../utils/economy');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Check your account balance')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to check the balance of')
        .setRequired(false)
    ),
  aliases: ['bal'],
  async execute(interaction) {
    const user = interaction.options.getUser('user') || interaction.user;

    try {
      const balance = await getUserBalance(user.id);

      const embed = new MessageEmbed()
        .setTitle(`${user.username}'s Balance`)
        .setDescription(`**Wallet:** ${balance.wallet} coins\n**Bank:** ${balance.bank} coins`)
        .setColor('#00ff00')
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error retrieving user balance:', error);

      const embed = new MessageEmbed()
        .setTitle('Error')
        .setDescription('An error occurred while retrieving the user balance.')
        .setColor('#ff0000')
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
  },
};
