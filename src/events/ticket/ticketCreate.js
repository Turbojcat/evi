const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Ticket, TicketQuestion } = require('../../database/database');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton()) return;

    const { customId } = interaction;

    if (customId === 'createTicket') {
      const guild = interaction.guild;
      const creator = interaction.user;

      try {
        const ticket = await Ticket.create({
          guildId: guild.id,
          creatorId: creator.id,
          status: 'open',
        });

        const ticketChannel = await guild.channels.create(`ticket-${ticket.id}`, {
          type: 'text',
          topic: `Ticket created by ${creator.tag}`,
          permissionOverwrites: [
            {
              id: guild.id,
              deny: ['VIEW_CHANNEL'],
            },
            {
              id: creator.id,
              allow: ['VIEW_CHANNEL', 'SEND_MESSAGES'],
            },
          ],
        });

        const questions = await TicketQuestion.findAll();

        const embed = new MessageEmbed()
          .setTitle('Ticket Questions')
          .setDescription('Please answer the following questions:')
          .setColor('#0099ff');

        questions.forEach((question, index) => {
          embed.addField(`Question ${index + 1}`, question.question);
        });

        await ticketChannel.send({ embeds: [embed] });

        await interaction.reply({
          content: `Your ticket has been created in ${ticketChannel}`,
          ephemeral: true,
        });
      } catch (error) {
        console.error('Error creating ticket:', error);
        await interaction.reply({
          content: 'An error occurred while creating the ticket.',
          ephemeral: true,
        });
      }
    }
  },
};