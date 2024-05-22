const { SlashCommandBuilder } = require('@discordjs/builders');
const { Permissions } = require('discord.js');
const { ModSettings } = require('../../database/models');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modsettings')
    .setDescription('Configures the automatic moderation system')
    .addSubcommand(subcommand =>
      subcommand
        .setName('forbiddenwords')
        .setDescription('Manages the list of forbidden words')
        .addStringOption(option =>
          option.setName('action')
            .setDescription('The action to perform (add or remove)')
            .setRequired(true)
            .addChoices(
              { name: 'Add', value: 'add' },
              { name: 'Remove', value: 'remove' }
            ))
        .addStringOption(option =>
          option.setName('word')
            .setDescription('The word to add or remove')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('streakthreshold')
        .setDescription('Sets the warning streak threshold')
        .addIntegerOption(option =>
          option.setName('threshold')
            .setDescription('The warning streak threshold')
            .setRequired(true)))
    .addSubcommand(subcommand =>
      subcommand
        .setName('streakaction')
        .setDescription('Sets the action to take when the warning streak threshold is reached')
        .addStringOption(option =>
          option.setName('action')
            .setDescription('The action to take (ban or kick)')
            .setRequired(true)
            .addChoices(
              { name: 'Ban', value: 'ban' },
              { name: 'Kick', value: 'kick' }
            ))),
  async execute(interaction) {
    if (!interaction.member.permissions.has(Permissions.MANAGE_GUILD)) {
      return interaction.reply({ content: 'You do not have permission to configure the moderation settings.', ephemeral: true });
    }

    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    try {
      let settings = await ModSettings.findOne({ where: { guildId } });
      if (!settings) {
        settings = await ModSettings.create({ guildId });
      }

      if (subcommand === 'forbiddenwords') {
        const action = interaction.options.getString('action');
        const word = interaction.options.getString('word');

        if (action === 'add') {
          if (!settings.forbiddenWords.includes(word)) {
            settings.forbiddenWords.push(word);
            await settings.save();
            await interaction.reply(`Added "${word}" to the list of forbidden words.`);
          } else {
            await interaction.reply(`"${word}" is already in the list of forbidden words.`);
          }
        } else if (action === 'remove') {
          if (settings.forbiddenWords.includes(word)) {
            settings.forbiddenWords = settings.forbiddenWords.filter(w => w !== word);
            await settings.save();
            await interaction.reply(`Removed "${word}" from the list of forbidden words.`);
          } else {
            await interaction.reply(`"${word}" is not in the list of forbidden words.`);
          }
        }
      } else if (subcommand === 'streakthreshold') {
        const threshold = interaction.options.getInteger('threshold');
        settings.streakThreshold = threshold;
        await settings.save();
        await interaction.reply(`Set the warning streak threshold to ${threshold}.`);
      } else if (subcommand === 'streakaction') {
        const action = interaction.options.getString('action');
        settings.streakAction = action;
        await settings.save();
        await interaction.reply(`Set the warning streak action to "${action}".`);
      }
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: 'There was an error configuring the moderation settings.', ephemeral: true });
    }
  },
};
