const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketStaffRole } = require('../../database/database');

module.exports = {
  name: 'commandlog',
  description: 'Configure command logging',
  data: new SlashCommandBuilder()
    .setName('log')
    .setDescription('Configure command logging')
    .addSubcommand(subcommand =>
      subcommand
        .setName('add')
        .setDescription('Add a channel for command logging')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel to add for command logging')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('remove')
        .setDescription('Remove a channel from command logging')
        .addChannelOption(option =>
          option.setName('channel')
            .setDescription('The channel to remove from command logging')
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
        content: 'You do not have permission to configure command logging.',
        ephemeral: true,
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand();
    const channel = interaction.options.getChannel('channel');

    if (subcommand === 'add') {
      // Add the channel to command logging
      // Implement the logic to store the channel ID/name for command logging
      await interaction.reply(`Added channel ${channel} to command logging.`);
    } else if (subcommand === 'remove') {
      // Remove the channel from command logging
      // Implement the logic to remove the channel ID/name from command logging
      await interaction.reply(`Removed channel ${channel} from command logging.`);
    }
  },
};
