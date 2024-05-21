const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { Ticket, TicketQuestion, TicketCategory } = require('../../database/database');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction) {
    if (!interaction.isButton() || interaction.customId !== 'createTicket') return;

    const { guild, member } = interaction;

    try {
      // Fetch the ticket category from the database
      const ticketCategory = await TicketCategory.findOne();

      if (!ticketCategory) {
        await interaction.reply({
          content: 'No ticket category has been set up. Please contact an administrator.',
          ephemeral: true,
        });
        return;
      }

      // Find the category channel by ID
const categoryChannel = guild.channels.cache.get(ticketCategory.categoryId);

if (!categoryChannel || categoryChannel.type !== 'GUILD_CATEGORY') {
  await interaction.reply({
    content: 'The specified ticket category is not a valid category channel. Please contact an administrator.',
    ephemeral: true,
  });
  return;
}

// Create a new ticket channel in the specified category
const ticketChannel = await guild.channels.create(`ticket-${member.user.username}`, {
  type: 'GUILD_TEXT',
  topic: `Ticket created by ${member.user.tag}`,
  parent: categoryChannel,
  permissionOverwrites: [
    {
      id: guild.id,
      deny: ['VIEW_CHANNEL'],
    },
    {
      id: member.id,
      allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'MANAGE_CHANNELS', 'CREATE_INSTANT_INVITE'],
    },
  ],
});

      // Create a new ticket in the database
      const ticket = await Ticket.create({
        guildId: guild.id,
        userId: member.id,
        channelId: ticketChannel.id,
        status: 'open',
      });

      // Fetch ticket questions from the database
      const questions = await TicketQuestion.findAll();

      // Create an embed with ticket questions
      const embed = new MessageEmbed()
        .setTitle('Ticket Questions')
        .setDescription('Please answer the following questions:')
        .setColor('#0099ff');

      questions.forEach((question, index) => {
        embed.addField(`Question ${index + 1}`, question.question);
      });

      // Send the embed to the ticket channel
      await ticketChannel.send({ embeds: [embed] });

      // Reply to the interaction
      await interaction.reply({
        content: `Your ticket has been created: ${ticketChannel}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      await interaction.reply({
        content: 'An error occurred while creating the ticket.',
        ephemeral: true,
      });
    }
  },
};
