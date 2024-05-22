// src/utils/permissionSystem.js
const { PermissionFlagsBits } = require('discord.js');

async function setupPermissionSystem(client) {
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
      logger.warn(`No command matching "${interaction.commandName}" was found.`);
      return;
    }

    // Check if the user has the required permissions to execute the command
    const requiredPermissions = command.permissions;

    if (requiredPermissions) {
      const userPermissions = interaction.member.permissions;

      if (!userPermissions.has(requiredPermissions)) {
        logger.info(`User ${interaction.user.tag} does not have the required permissions to execute command "${command.name}".`);
        await interaction.reply({
          content: 'You do not have the required permissions to execute this command.',
          ephemeral: true,
        });
        return;
      }
    }

    // Check if the command requires a specific role
    const requiredRole = command.requiredRole;

    if (requiredRole) {
      const role = interaction.guild.roles.cache.find((role) => role.name === requiredRole);

      if (!role || !interaction.member.roles.cache.has(role.id)) {
        logger.info(`User ${interaction.user.tag} does not have the required role "${requiredRole}" to execute command "${command.name}".`);
        await interaction.reply({
          content: `You must have the "${requiredRole}" role to execute this command.`,
          ephemeral: true,
        });
        return;
      }
    }

    try {
      await command.execute(interaction);
    } catch (error) {
      logger.error(`Error executing command "${command.name}":`, error);
      await interaction.reply({
        content: 'There was an error while executing this command!',
        ephemeral: true,
      });
    }
  });
}

module.exports = {
  setupPermissionSystem,
};
