const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketpanel')
    .setDescription('Manages the ticket panel')
    .addSubcommand(subcommand =>
      subcommand
        .setName('addpanel')
        .setDescription('Adds a ticket panel to the specified channel')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel to add the ticket panel to')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('removepanel')
        .setDescription('Removes the ticket panel from the specified channel')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel to remove the ticket panel from')
            .setRequired(false)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === 'addpanel') {
      await this.execute_addpanel(interaction);
    } else if (subcommand === 'removepanel') {
      await this.execute_removepanel(interaction);
    }
  },
  async execute_addpanel(interaction) {
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    const embed = new EmbedBuilder()
      .setTitle('Create a Ticket')
      .setDescription('Click the button below to create a new ticket.')
      .setColor('#0099ff');

    const row = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('createTicket')
          .setLabel('Open a Ticket!')
          .setStyle(ButtonStyle.Primary)
      );

    await channel.send({ embeds: [embed], components: [row] });
    await interaction.reply({ content: 'Ticket panel added successfully!', ephemeral: true });
  },
  async execute_removepanel(interaction) {
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    // Implement the logic to remove the ticket panel from the specified channel
    // ...

    await interaction.reply({ content: 'Ticket panel removed successfully!', ephemeral: true });
  },
};
