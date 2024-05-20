// src/commands/ticket/tickettranscript.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tickettranscript')
    .setDescription('Manages ticket transcript channels')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Adds a transcript channel for closed tickets')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel to add as a transcript channel')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Removes a transcript channel for closed tickets')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel to remove as a transcript channel')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel('channel');

    if (subcommand === 'add') {
      // Code to add the transcript channel to the ticket system
      // ...
    } else if (subcommand === 'remove') {
      // Code to remove the transcript channel from the ticket system
      // ...
    }
  },
};
