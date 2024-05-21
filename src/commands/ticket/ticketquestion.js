// src/commands/ticket/ticketquestion.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketQuestion } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketquestion')
    .setDescription('Manages ticket questions')
    .addSubcommand(subcommand =>
      subcommand
        .setName('addquestion')
        .setDescription('Adds a question to the ticket system')
        .addStringOption(option =>
          option.setName('question')
            .setDescription('The question to add')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('removequestion')
        .setDescription('Removes a question from the ticket system')
        .addStringOption(option =>
          option.setName('question')
            .setDescription('The question to remove')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const question = interaction.options.getString('question');
    const guildId = interaction.guild.id;

    if (subcommand === 'add') {
      try {
        await TicketQuestion.create({ guildId, question });
        await interaction.reply({ content: 'Question added successfully!', ephemeral: true });
      } catch (error) {
        console.error('Error adding question:', error);
        await interaction.reply({ content: 'An error occurred while adding the question.', ephemeral: true });
      }
    } else if (subcommand === 'remove') {
      try {
        await TicketQuestion.destroy({ where: { guildId, question } });
        await interaction.reply({ content: 'Question removed successfully!', ephemeral: true });
      } catch (error) {
        console.error('Error removing question:', error);
        await interaction.reply({ content: 'An error occurred while removing the question.', ephemeral: true });
      }
    }
  },
};