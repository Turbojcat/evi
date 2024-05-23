const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  description: 'Displays a list of available commands',
  aliases: ['commands', 'cmds'],
  usage: '!help',
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of available commands'),
  async execute(interaction) {
    const commandsPath = path.join(__dirname, '..');
    const commandFolders = fs.readdirSync(commandsPath).filter(folder => fs.statSync(path.join(commandsPath, folder)).isDirectory());

    const user = interaction.user;
    const member = interaction.member;
    const isAdmin = member.permissions.has('ADMINISTRATOR');
    const isOwner = interaction.client.application.owner.id === user.id;

    const filteredCategories = commandFolders.filter(category => {
      const categoryPath = path.join(commandsPath, category);
      const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

      return commandFiles.some(file => {
        const command = require(path.join(categoryPath, file));
        if (command.ownerOnly && !isOwner) return false;
        if (command.adminOnly && !isAdmin) return false;
        if (command.staffOnly && !member.roles.cache.some(role => role.name === 'Staff')) return false;
        return true;
      });
    });

    if (filteredCategories.length === 0) {
      return interaction.reply({ content: 'No available commands for your permissions.', ephemeral: true });
    }

    const helpEmbeds = [];
    let currentEmbedFields = [];

    for (const categoryName of filteredCategories) {
      const categoryPath = path.join(__dirname, '..', categoryName);
      const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

      const filteredCommands = commandFiles.map(file => {
        const command = require(path.join(categoryPath, file));
        if (command.ownerOnly && !isOwner) return null;
        if (command.adminOnly && !isAdmin) return null;
        if (command.staffOnly && !member.roles.cache.some(role => role.name === 'Staff')) return null;
        return command;
      }).filter(command => command !== null);

      const categoryEmbed = new EmbedBuilder()
        .setTitle(`${categoryName.toUpperCase()} Commands`)
        .setColor('#0099ff');

      for (const command of filteredCommands) {
        const commandName = command.data ? command.data.name : command.name;
        const commandDescription = command.data ? command.data.description : command.description;
        const commandAliases = command.aliases ? command.aliases.map(alias => `\`${alias}\``).join(', ') : '';
        const commandCooldown = command.cooldown ? `${command.cooldown} seconds` : 'No cooldown';
        const commandRole = command.role ? `${command.role}` : 'everyone';
        const commandPermission = command.permission ? `${command.permission}` : 'No specific permission required';

        let commandField = `**/${commandName}**\n${commandDescription}\n\n`;

        if (command.data && command.data.options && command.data.options.length > 0) {
          const subcommands = command.data.options.filter(option => option.type === 1);

          if (subcommands.length > 0) {
            let subcommandsText = '';

            subcommands.forEach(subcommand => {
              subcommandsText += `\n- \`/${commandName} ${subcommand.name}\`: ${subcommand.description}`;
            });

            commandField += `Subcommands:${subcommandsText}\n\n`;
          }
        }

        commandField += `Aliases: ${commandAliases}\nCooldown: ${commandCooldown}\nRole: ${commandRole}\nPermission: ${commandPermission}`;

        if (currentEmbedFields.length + commandField.length > 5000) {
          helpEmbeds.push(categoryEmbed);
          currentEmbedFields = [];
          categoryEmbed.setDescription('Here is a list of available commands in the category:');
        }

        categoryEmbed.addFields({ name: `/${commandName}`, value: commandField });
        currentEmbedFields.push(commandField);
      }

      // Add custom placeholder commands
      categoryEmbed.addFields({
        name: 'Custom Placeholders',
        value: `
          \`/create-custom-placeholder\` - Create a new custom placeholder
          \`/edit-custom-placeholder\` - Edit an existing custom placeholder
          \`/delete-custom-placeholder\` - Delete a custom placeholder
        `,
      });

      helpEmbeds.push(categoryEmbed);
    }

    if (helpEmbeds.length === 0) {
      return interaction.reply({ content: 'No available commands for your permissions.', ephemeral: true });
    }

    let currentPage = 0;
    const embeds = helpEmbeds.map(embed => embed.setFooter({ text: `Page ${helpEmbeds.indexOf(embed) + 1} of ${helpEmbeds.length}` }));

    const previousButton = new ButtonBuilder()
      .setCustomId('previous')
      .setLabel('Previous')
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true);

    const nextButton = new ButtonBuilder()
      .setCustomId('next')
      .setLabel('Next')
      .setStyle(ButtonStyle.Primary);

    const actionRow = new ActionRowBuilder().addComponents(previousButton, nextButton);

    const message = await interaction.reply({ embeds: [embeds[0]], components: [actionRow] });

    const filter = i => i.customId === 'previous' || i.customId === 'next';
    const collector = message.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async i => {
      if (i.customId === 'previous') {
        currentPage--;
      } else {
        currentPage++;
      }

      previousButton.setDisabled(currentPage === 0);
      nextButton.setDisabled(currentPage === embeds.length - 1);

      await i.update({ embeds: [embeds[currentPage]], components: [actionRow] });
    });

    collector.on('end', async () => {
      previousButton.setDisabled(true);
      nextButton.setDisabled(true);
      await interaction.editReply({ components: [actionRow] });
    });
  },
};
