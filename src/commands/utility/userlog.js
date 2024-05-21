const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketStaffRole } = require('../../database/database');

module.exports = {
  name: 'userlog',
  description: 'Configure user logging',
  data: new SlashCommandBuilder()
    .setName('userlog')
    .setDescription('Configure user logging')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a channel for user logging')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel to add for user logging')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a channel from user logging')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel to remove from user logging')
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
        content: 'You do not have permission to configure user logging.',
        ephemeral: true,
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel('channel');

    if (subcommand === 'add') {
      // Add the channel to user logging
      // Implement the logic to store the channel ID/name for user logging
      await interaction.reply(`Added channel ${channel} to user logging.`);
    } else if (subcommand === 'remove') {
      // Remove the channel from user logging
      // Implement the logic to remove the channel ID/name from user logging
      await interaction.reply(`Removed channel ${channel} from user logging.`);
    }
  },
};
