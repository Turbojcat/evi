const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
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
  async execute(interaction, message) {
    console.log('Executing help command');

    const commandsPath = path.join(__dirname, '..');
    const commandFolders = fs.readdirSync(commandsPath).filter(folder => fs.statSync(path.join(commandsPath, folder)).isDirectory());

    console.log('Categories:', commandFolders);

    const user = interaction ? interaction.user : message ? message.author : null;
    const member = interaction ? interaction.member : message ? message.member : null;
    const isAdmin = member ? member.permissions.has('ADMINISTRATOR') : false;
    const isOwner = interaction && interaction.client.application.owner ? interaction.client.application.owner.id === user.id : false;

    console.log('User:', user);
    console.log('Member:', member);
    console.log('Is Admin:', isAdmin);
    console.log('Is Owner:', isOwner);

    const filteredCategories = commandFolders.filter(category => {
      const categoryPath = path.join(commandsPath, category);
      const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

      return commandFiles.some(file => {
        const command = require(path.join(categoryPath, file));
        if (command.ownerOnly && !isOwner) return false;
        if (command.adminOnly && !isAdmin) return false;
        if (command.staffOnly && member && !member.roles.cache.some(role => role.name === 'Staff')) return false;
        return true;
      });
    });

    console.log('Filtered Categories:', filteredCategories);

    if (filteredCategories.length === 0) {
      console.log('No available commands for user permissions');
      if (interaction) {
        return interaction.reply({ content: 'No available commands for your permissions.', ephemeral: true });
      } else if (message) {
        return message.reply('No available commands for your permissions.');
      }
    }

    console.log('Sending category select menu');
    await sendCategorySelectMenu(interaction, message, filteredCategories);
  },
};

async function sendCategoryHelpEmbed(interaction, message, categoryName) {
  console.log('Sending category help embed');

  const categoryPath = path.join(__dirname, '..', categoryName);
  const commandFiles = fs.readdirSync(categoryPath).filter(file => file.endsWith('.js'));

  const user = interaction ? interaction.user : message ? message.author : null;
  const member = interaction ? interaction.member : message ? message.member : null;
  const isAdmin = member ? member.permissions.has('ADMINISTRATOR') : false;
  const isOwner = interaction && interaction.client.application.owner ? interaction.client.application.owner.id === user.id : false;

  const filteredCommands = commandFiles.map(file => {
    const command = require(path.join(categoryPath, file));
    if (command.ownerOnly && !isOwner) return null;
    if (command.adminOnly && !isAdmin) return null;
    if (command.staffOnly && member && !member.roles.cache.some(role => role.name === 'Staff')) return null;
    return command;
  }).filter(command => command !== null);

  console.log('Filtered Commands:', filteredCommands);

  const helpEmbed = new EmbedBuilder()
    .setTitle(`${categoryName.toUpperCase()} Commands`)
    .setDescription(`Here is a list of available commands in the ${categoryName} category:`)
    .setColor('#0099ff')
    .setFooter({ text: `Support for ${interaction ? interaction.client.user.tag : message ? message.client.user.tag : 'Unknown'} at **!support**` })
    .setTimestamp();

  filteredCommands.forEach(command => {
    const commandName = command.data ? command.data.name : command.name;
    const commandDescription = command.data ? command.data.description : command.description;
    const commandAliases = command.aliases ? command.aliases.map(alias => `\`${alias}\``).join(', ') : '';
    const commandCooldown = command.cooldown ? `${command.cooldown} seconds` : 'No cooldown';
    const commandRole = command.role ? `${command.role}` : 'everyone';
    const commandPermission = command.permission ? `${command.permission}` : 'No specific permission required';

    if (command.data && command.data.options && command.data.options.length > 0) {
      const subcommands = command.data.options.filter(option => option.type === 1);

      if (subcommands.length > 0) {
        let subcommandsText = '';

        subcommands.forEach(subcommand => {
          subcommandsText += `\n- \`/${commandName} ${subcommand.name}\`: ${subcommand.description}`;
        });

        helpEmbed.addFields({
          name: `/${commandName}`,
          value: `${commandDescription}\n\nSubcommands:${subcommandsText}\n\nAliases: ${commandAliases}\nCooldown: ${commandCooldown}\nRole: ${commandRole}\nPermission: ${commandPermission}`
        });
      } else {
        helpEmbed.addFields({
          name: `/${commandName}`,
          value: `${commandDescription}\n\nAliases: ${commandAliases}\nCooldown: ${commandCooldown}\nRole: ${commandRole}\nPermission: ${commandPermission}`
        });
      }
    } else {
      helpEmbed.addFields({
        name: `!${commandName}`,
        value: `${commandDescription}\n\nAliases: ${commandAliases}\nCooldown: ${commandCooldown}\nRole: ${commandRole}\nPermission: ${commandPermission}`
      });
    }
  });

  if (interaction) {
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({ embeds: [helpEmbed] });
    } else {
      await interaction.reply({ embeds: [helpEmbed] });
    }
  } else if (message) {
    await message.channel.send({ embeds: [helpEmbed] });
  }
}

async function sendCategorySelectMenu(interaction, message, categories) {
  console.log('Creating category select menu');

  if (categories.length === 0) {
    console.log('No valid categories found');
    if (interaction) {
      return interaction.reply({ content: 'No command categories available.', ephemeral: true });
    } else if (message) {
      return message.reply('No command categories available.');
    }
  }

  const selectMenu = new StringSelectMenuBuilder()
    .setCustomId('help_category_select')
    .setPlaceholder('Select a category')
    .setOptions(
      categories.map(category => ({
        label: category.charAt(0).toUpperCase() + category.slice(1),
        value: category,
      }))
    );

  console.log('Select Menu:', selectMenu);

  const actionRow = new ActionRowBuilder().addComponents(selectMenu);

  console.log('Action Row:', actionRow);

  let reply;
  if (interaction) {
    if (interaction.replied || interaction.deferred) {
      reply = await interaction.followUp({
        content: 'Please select a category to view commands:',
        components: [actionRow],
        ephemeral: true,
        fetchReply: true,
      });
    } else {
      reply = await interaction.reply({
        content: 'Please select a category to view commands:',
        components: [actionRow],
        ephemeral: true,
        fetchReply: true,
      });
    }
  } else if (message) {
    reply = await message.channel.send({
      content: 'Please select a category to view commands:',
      components: [actionRow],
    });
  }

  if (!reply) {
    console.log('Failed to send category select menu');
    return;
  }

  const filter = i => {
    if (i.customId === 'help_category_select') {
      if (interaction && i.user.id === interaction.user?.id) {
        return true;
      } else if (message && i.user.id === message.author?.id) {
        return true;
      }
    }
    return false;
  };

  const collector = reply.createMessageComponentCollector({ filter, time: 60000 });

  collector.on('collect', async i => {
    console.log('Category selected:', i.values[0]);

    const selectedCategory = i.values[0];

    await i.update({ content: 'Loading category commands...', components: [] });
    await sendCategoryHelpEmbed(interaction, message, selectedCategory);
  });

  collector.on('end', async (collected, reason) => {
    if (reason === 'time') {
      console.log('Help menu timed out');

      if (reply.editable) {
        await reply.edit({ content: 'Help menu timed out.', components: [] });
      }
    }
  });
}
