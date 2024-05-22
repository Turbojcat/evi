const { SlashCommandBuilder } = require('@discordjs/builders');
const { PermissionFlagsBits } = require('discord.js');
const { ModLogChannel } = require('../../database/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Warns a user')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to warn')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('The reason for the warning')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setDMPermission(false),
  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const reason = interaction.options.getString('reason') || 'No reason provided';

    try {
      // Lagre advarselen i databasen
      // Du kan opprette en ny modell for advarsler og lagre informasjonen der
      // Eksempel: await Warning.create({ userId: user.id, reason, moderatorId: interaction.user.id });

      // Send en DM til brukeren om advarselen
      await user.send(`You have been warned in ${interaction.guild.name} for the following reason: ${reason}`);

      // Send et svar til moderatoren
      await interaction.reply(`User ${user.tag} has been warned.`);

      // Logg advarselen i modereringsloggen
      const modLogChannel = await ModLogChannel.findOne({
        where: { guildId: interaction.guildId },
      });

      if (modLogChannel) {
        const channel = interaction.guild.channels.cache.get(modLogChannel.channelId);

        if (channel) {
          const embed = {
            color: 0xffff00,
            title: 'User Warned',
            fields: [
              {
                name: 'User',
                value: `${user.tag} (${user.id})`,
              },
              {
                name: 'Moderator',
                value: `${interaction.user.tag} (${interaction.user.id})`,
              },
              {
                name: 'Reason',
                value: reason,
              },
            ],
            timestamp: new Date(),
          };

          await channel.send({ embeds: [embed] });
        }
      }
    } catch (error) {
      console.error('Error warning user:', error);
      await interaction.reply('An error occurred while warning the user. Please try again later.');
    }
  },
};
