// src/commands/ticket/ticketlog.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketLog } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketlog')
    .setDescription('Manages ticket log channels')
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Sets the ticket log channel')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel to set as the ticket log channel')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Removes the ticket log channel')
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;

    if (subcommand === 'set') {
      const channel = interaction.options.getChannel('channel');

      try {
        const existingLog = await TicketLog.findOne({
          where: { guildId: guild.id },
        });

        if (existingLog) {
          await existingLog.update({ channelId: channel.id });
        } else {
          await TicketLog.create({
            guildId: guild.id,
            channelId: channel.id,
          });
        }

        await interaction.reply({
          content: `Ticket log channel set to ${channel}`,
          ephemeral: true,
        });
      } catch (error) {
        console.error('Error setting ticket log channel:', error);
        await interaction.reply({
          content: 'An error occurred while setting the ticket log channel.',
          ephemeral: true,
        });
      }
    } else if (subcommand === 'remove') {
      try {
        const existingLog = await TicketLog.findOne({
          where: { guildId: guild.id },
        });

        if (existingLog) {
          await existingLog.destroy();
          await interaction.reply({
            content: 'Ticket log channel removed successfully.',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: 'No ticket log channel is currently set.',
            ephemeral: true,
          });
        }
      } catch (error) {
        console.error('Error removing ticket log channel:', error);
        await interaction.reply({
          content: 'An error occurred while removing the ticket log channel.',
          ephemeral: true,
        });
      }
    }
  },
};