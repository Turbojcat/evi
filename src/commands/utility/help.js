const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Displays a list of available commands')
    .addStringOption(option =>
      option.setName('category')
        .setDescription('Select a specific category to view commands')
        .setRequired(false)
        .addChoices(
          { name: 'Utility', value: 'utility' },
          { name: 'Moderation', value: 'moderation' },
          { name: 'Fun', value: 'fun' }
        )
    ),
  async execute(interaction) {
    const commands = interaction.client.commands;
    const categoryOption = interaction.options?.getString('category');

    if (interaction.commandName === 'help') {
      if (categoryOption) {
        const categoryCommands = commands.filter(command => command.category === categoryOption);
        await sendCategoryHelpEmbed(interaction, categoryCommands, categoryOption);
      } else {
        const categories = [...new Set(commands.map(command => command.category))];
        await sendCategorySelectMenu(interaction, categories);
      }
    } else {
      const categories = [...new Set(commands.map(command => command.category))];
      await sendCategoryHelpEmbed(interaction, commands, 'All');
    }
  },
};

async function sendCategoryHelpEmbed(interaction, categoryCommands, categoryName) {
  const helpEmbed = new MessageEmbed()
    .setTitle(`${categoryName.toUpperCase()} Commands`)
    .setDescription(`Here is a list of available commands in the ${categoryName} category:`)
    .setColor('#0099ff');

  categoryCommands.forEach(command => {
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
}

async function sendCategorySelectMenu(interaction, categories) {
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

  await interaction.reply({
    content: 'Please select a category to view commands:',
    components: [selectMenu],
    ephemeral: true,
  });

  const filter = i => i.customId === 'help_category_select' && i.user.id === interaction.user.id;
  const collector = interaction.channel.createMessageComponentCollector({ filter, time: 60000 });

  collector.on('collect', async i => {
    const selectedCategory = i.values[0];
    const categoryCommands = commands.filter(command => command.category === selectedCategory);

    await i.update({ content: 'Loading category commands...', components: [] });
    await sendCategoryHelpEmbed(interaction, categoryCommands, selectedCategory);
  });

  collector.on('end', async (collected, reason) => {
    if (reason === 'time') {
      await interaction.editReply({ content: 'Help menu timed out.', components: [] });
    }
  });
}