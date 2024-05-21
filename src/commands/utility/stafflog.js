const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketStaffRole } = require('../../database/database');

module.exports = {
  name: 'stafflog',
  description: 'Configure staff logging',
  data: new SlashCommandBuilder()
    .setName('stafflog')
    .setDescription('Configure staff logging')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a channel for staff logging')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel to add for staff logging')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a channel from staff logging')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel to remove from staff logging')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const staffRoles = await TicketStaffRole.findAll({
      where: { guildId: interaction.guild.id },
    });

    const isStaff = staffRoles.some(role => interaction.member.roles.cache.has(role.roleId));

    if (!isStaff) {
      await interaction.reply({
        content: 'You do not have permission to configure staff logging.',
        ephemeral: true,
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel('channel');

    if (subcommand === 'add') {
      // Add the channel to staff logging
      // Implement the logic to store the channel ID/name for staff logging
      await interaction.reply(`Added channel ${channel} to staff logging.`);
    } else if (subcommand === 'remove') {
      // Remove the channel from staff logging
      // Implement the logic to remove the channel ID/name from staff logging
      await interaction.reply(`Removed channel ${channel} from staff logging.`);
    }
  },
};
