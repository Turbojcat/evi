// src/commands/ticket/ticketlog.js
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketlog')
    .setDescription('Manages ticket log channels')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Adds a log channel for deleted tickets')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel to add as a log channel')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Removes a log channel for deleted tickets')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel to remove as a log channel')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel('channel');

    if (subcommand === 'add') {
      // Code to add the log channel to the ticket system
      // ...
    } else if (subcommand === 'remove') {
      // Code to remove the log channel from the ticket system
      // ...
    }
  },
};
