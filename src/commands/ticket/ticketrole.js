// src/commands/ticket/ticketrole.js
const { SlashCommandBuilder } = require('@discordjs/builders');
const { TicketStaffRole } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ticketrole')
    .setDescription('Manages ticket staff roles')
    .addSubcommand(subcommand =>
      subcommand
        .setName('addrole')
        .setDescription('Adds a staff role to the ticket system')
        .addRoleOption(option =>
          option.setName('role')
            .setDescription('The role to add')
            .setRequired(true)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('removerole')
        .setDescription('Removes a staff role from the ticket system')
        .addRoleOption(option =>
          option.setName('role')
            .setDescription('The role to remove')
            .setRequired(true)
        )
    ),
  async execute(interaction) {
    const subcommand = interaction.options.getSubcommand();
    const role = interaction.options.getRole('role');

    if (subcommand === 'add') {
      const roleId = role.id;

      try {
        await TicketStaffRole.create({ roleId });
        await interaction.reply({ content: 'Staff role added successfully!', ephemeral: true });
      } catch (error) {
        console.error('Error adding staff role:', error);
        await interaction.reply({ content: 'An error occurred while adding the staff role.', ephemeral: true });
      }
    } else if (subcommand === 'remove') {
      const roleId = role.id;

      try {
        const staffRole = await TicketStaffRole.findOne({ where: { roleId } });
        if (!staffRole) {
          await interaction.reply({ content: 'Staff role not found.', ephemeral: true });
          return;
        }

        await staffRole.destroy();
        await interaction.reply({ content: 'Staff role removed successfully!', ephemeral: true });
      } catch (error) {
        console.error('Error removing staff role:', error);
        await interaction.reply({ content: 'An error occurred while removing the staff role.', ephemeral: true });
      }
    }
  },
};
