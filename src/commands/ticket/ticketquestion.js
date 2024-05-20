// src/commands/ticket/ticketquestion.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketQuestion } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketquestion')
    .setDescription('Manages ticket questions')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Adds a question to the ticket system')
        .addStringOption(option =>
          option.setName('question')
            .setDescription('The question to add')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Removes a question from the ticket system')
        .addStringOption(option =>
          option.setName('question_id')
            .setDescription('The ID of the question to remove')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'add') {
      const question = interaction.options.getString('question');

      try {
        await TicketQuestion.create({ question });
        await interaction.reply({ content: 'Question added successfully!', ephemeral: true });
      } catch (error) {
        console.error('Error adding question:', error);
        await interaction.reply({ content: 'An error occurred while adding the question.', ephemeral: true });
      }
    } else if (subcommand === 'remove') {
      const questionId = interaction.options.getString('question_id');

      try {
        const question = await TicketQuestion.findOne({ where: { id: questionId } });
        if (!question) {
          await interaction.reply({ content: 'Question not found.', ephemeral: true });
          return;
        }

        await question.destroy();
        await interaction.reply({ content: 'Question removed successfully!', ephemeral: true });
      } catch (error) {
        console.error('Error removing question:', error);
        await interaction.reply({ content: 'An error occurred while removing the question.', ephemeral: true });
      }
    }
  },
};
