const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of available commands'),
  async execute(interaction) {
    const commands = interaction.client.commands;

    const helpEmbed = new MessageEmbed()
      .setTitle('Available Commands')
      .setDescription('Here is a list of available commands:')
      .setColor('#0099ff');

    commands.forEach(command => {
      const commandName = command.data.name;
      const commandDescription = command.data.description;

      if (command.data.options && command.data.options.length > 0) {
        const subcommands = command.data.options.filter(option => option.type === 'SUB_COMMAND');

        if (subcommands.length > 0) {
          let subcommandsText = '';

          subcommands.forEach(subcommand => {
            subcommandsText += `\n- \`/${commandName} ${subcommand.name}\`: ${subcommand.description}`;
          });

          helpEmbed.addField(`/${commandName}`, `${commandDescription}\n\nSubcommands:${subcommandsText}`);
        } else {
          helpEmbed.addField(`/${commandName}`, commandDescription);
        }
      } else {
        helpEmbed.addField(`/${commandName}`, commandDescription);
      }
    });

    await interaction.reply({ embeds: [helpEmbed] });
  },
};