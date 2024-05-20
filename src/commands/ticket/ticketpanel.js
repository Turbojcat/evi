// src/commands/ticket/ticketpanel.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketpanel')
    .setDescription('Manages the ticket panel')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Adds a ticket panel to the specified channel')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel to add the ticket panel to')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Removes the ticket panel from the specified channel')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel to remove the ticket panel from')
            .setRequired(false)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel('channel') || interaction.channel;

    if (subcommand === 'add') {
      const embed = new MessageEmbed()
        .setTitle('Create a Ticket')
        .setDescription('Click the button below to create a new ticket.')
        .setColor('#0099ff');

      const row = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('createTicket')
            .setLabel('Create Ticket')
            .setStyle('PRIMARY')
        );

      try {
        await channel.send({ embeds: [embed], components: [row] });
        await interaction.reply({ content: 'Ticket panel added successfully!', ephemeral: true });
      } catch (error) {
        console.error('Error adding ticket panel:', error);
        await interaction.reply({ content: 'An error occurred while adding the ticket panel.', ephemeral: true });
      }
    } else if (subcommand === 'remove') {
      try {
        const messages = await channel.messages.fetch({ limit: 100 });
        const panelMessage = messages.find(message => message.author.id === interaction.client.user.id && message.embeds.length > 0);

        if (panelMessage) {
          await panelMessage.delete();
          await interaction.reply({ content: 'Ticket panel removed successfully!', ephemeral: true });
        } else {
          await interaction.reply({ content: 'Ticket panel not found in the specified channel.', ephemeral: true });
        }
      } catch (error) {
        console.error('Error removing ticket panel:', error);
        await interaction.reply({ content: 'An error occurred while removing the ticket panel.', ephemeral: true });
      }
    }
  },
};
