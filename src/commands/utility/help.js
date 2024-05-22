const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  description: 'Displays a list of available commands',
  aliases: ['commands', 'cmds'],
  cooldown: 5,
  role: 'everyone',
  permission: 'SEND_MESSAGES',
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of available commands'),
  async execute(interaction, message) {
    const commands = interaction.client.commands;
    const commandFolders = fs.readdirSync(path.join(__dirname, '..', 'commands'));
    const categories = commandFolders.filter(folder => fs.statSync(path.join(__dirname, '..', 'commands', folder)).isDirectory());

    const user = interaction?.user || message?.author;
    const member = interaction?.guild.members.cache.get(user.id) || message?.guild.members.cache.get(user.id);
    const isAdmin = member.permissions.has('ADMINISTRATOR');
    const isOwner = user.id === interaction?.client.application.owner.id || user.id === message?.client.application.owner.id;

    const filteredCategories = categories.filter(category => {
      const categoryCommands = commands.filter(command => command.category === category);
      return categoryCommands.some(command => {
        if (command.ownerOnly && !isOwner) return false;
        if (command.adminOnly && !isAdmin) return false;
        if (command.staffOnly && !member.roles.cache.some(role => role.name === 'Staff')) return false;
        return true;
      });
    });

    if (filteredCategories.length === 0) {
      return interaction?.reply({ content: 'No available commands for your permissions.', ephemeral: true }) ||
        message?.reply('No available commands for your permissions.');
    }

    await sendCategorySelectMenu(interaction, message, filteredCategories);
  },
};

async function sendCategoryHelpEmbed(interaction, message, categoryCommands, categoryName) {
  const user = interaction?.user || message?.author;
  const member = interaction?.guild.members.cache.get(user.id) || message?.guild.members.cache.get(user.id);
  const isAdmin = member.permissions.has('ADMINISTRATOR');
  const isOwner = user.id === interaction?.client.application.owner.id || user.id === message?.client.application.owner.id;

  const filteredCommands = categoryCommands.filter(command => {
    if (command.ownerOnly && !isOwner) return false;
    if (command.adminOnly && !isAdmin) return false;
    if (command.staffOnly && !member.roles.cache.some(role => role.name === 'Staff')) return false;
    return true;
  });

  const helpEmbed = new MessageEmbed()
    .setTitle(`${categoryName.toUpperCase()} Commands`)
    .setDescription(`Here is a list of available commands in the ${categoryName} category:`)
    .setColor('#0099ff')
    .setFooter({ text: `Support for ${interaction.client.user.tag} at **!support**` })
    .setTimestamp();

  filteredCommands.forEach(command => {
    const commandName = command.data.name;
    const commandDescription = command.data.description;
    const commandAliases = command.aliases ? command.aliases.map(alias => `\`${alias}\``).join(', ') : '';
    const commandCooldown = command.cooldown ? `${command.cooldown} seconds` : 'No cooldown';
    const commandRole = command.role ? `${command.role}` : 'everyone';
    const commandPermission = command.permission ? `${command.permission}` : 'No specific permission required';

    if (command.data.options && command.data.options.length > 0) {
      const subcommands = command.data.options.filter(option => option.type === 'SUB_COMMAND');

      if (subcommands.length > 0) {
        let subcommandsText = '';

        subcommands.forEach(subcommand => {
          subcommandsText += `\n- \`/${commandName} ${subcommand.name}\`: ${subcommand.description}`;
        });

        helpEmbed.addField(
          `/${commandName}`,
          `${commandDescription}\n\nSubcommands:${subcommandsText}\n\nAliases: ${commandAliases}\nCooldown: ${commandCooldown}\nRole: ${commandRole}\nPermission: ${commandPermission}`
        );
      } else {
        helpEmbed.addField(
          `/${commandName}`,
          `${commandDescription}\n\nAliases: ${commandAliases}\nCooldown: ${commandCooldown}\nRole: ${commandRole}\nPermission: ${commandPermission}`
        );
      }
    } else {
      helpEmbed.addField(
        `/${commandName}`,
        `${commandDescription}\n\nAliases: ${commandAliases}\nCooldown: ${commandCooldown}\nRole: ${commandRole}\nPermission: ${commandPermission}`
      );
    }
  });

  if (interaction) {
    await interaction.reply({ embeds: [helpEmbed] });
  } else if (message) {
    await message.channel.send({ embeds: [helpEmbed] });
  }
}

async function sendCategorySelectMenu(interaction, message, categories) {
  const selectMenu = new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId('help_category_select')
        .setPlaceholder('Select a category')
        .addOptions(
          categories.map(category => ({
            label: category.charAt(0).toUpperCase() + category.slice(1),
            value: category,
          }))
        )
    );

  if (interaction) {
    await interaction.reply({
      content: 'Please select a category to view commands:',
      components: [selectMenu],
      ephemeral: true,
    });
  } else if (message) {
    await message.channel.send({
      content: 'Please select a category to view commands:',
      components: [selectMenu],
    });
  }

  const filter = i => i.customId === 'help_category_select' && (i.user.id === interaction?.user.id || i.user.id === message?.author.id);
  const collector = interaction?.channel.createMessageComponentCollector({ filter, time: 60000 }) || message?.channel.createMessageComponentCollector({ filter, time: 60000 });

  collector.on('collect', async i => {
    const selectedCategory = i.values[0];
    const categoryCommands = interaction.client.commands.filter(command => command.category === selectedCategory);

    await i.update({ content: 'Loading category commands...', components: [] });
    await sendCategoryHelpEmbed(interaction, message, categoryCommands, selectedCategory);
  });

  collector.on('end', async (collected, reason) => {
    if (reason === 'time') {
      if (interaction) {
        await interaction.editReply({ content: 'Help menu timed out.', components: [] });
      } else if (message) {
        await message.edit({ content: 'Help menu timed out.', components: [] });
      }
    }
  });
}
