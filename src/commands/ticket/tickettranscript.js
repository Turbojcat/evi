// src/commands/ticket/tickettranscript.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketTranscript } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('tickettranscript')
    .setDescription('Manages ticket transcript channels')
    .addSubcommand(subcommand =>
      subcommand
        .setName('settranscript')
        .setDescription('Sets the ticket transcript channel')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel to set as the ticket transcript channel')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('removetranscript')
        .setDescription('Removes the ticket transcript channel')
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const guild = interaction.guild;

    if (subcommand === 'settranscript') {
      const channel = interaction.options.getChannel('channel');

      try {
        const existingTranscript = await TicketTranscript.findOne({
          where: { guildId: guild.id },
        });

        if (existingTranscript) {
          await existingTranscript.update({ channelId: channel.id });
        } else {
          await TicketTranscript.create({
            guildId: guild.id,
            channelId: channel.id,
          });
        }

        await interaction.reply({
          content: `Ticket transcript channel set to ${channel}`,
          ephemeral: true,
        });
      } catch (error) {
        console.error('Error setting ticket transcript channel:', error);
        await interaction.reply({
          content: 'An error occurred while setting the ticket transcript channel.',
          ephemeral: true,
        });
      }
    } else if (subcommand === 'removetranscript') {
      try {
        const existingTranscript = await TicketTranscript.findOne({
          where: { guildId: guild.id },
        });

        if (existingTranscript) {
          await existingTranscript.destroy();
          await interaction.reply({
            content: 'Ticket transcript channel removed successfully.',
            ephemeral: true,
          });
        } else {
          await interaction.reply({
            content: 'No ticket transcript channel is currently set.',
            ephemeral: true,
          });
        }
      } catch (error) {
        console.error('Error removing ticket transcript channel:', error);
        await interaction.reply({
          content: 'An error occurred while removing the ticket transcript channel.',
          ephemeral: true,
        });
      }
    }
  },
};