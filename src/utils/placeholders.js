// src/utils/placeholders.js
const CustomPlaceholder = require('../database/models/CustomPlaceholder');

async function replacePlaceholders(content, interaction) {
  const customPlaceholders = await CustomPlaceholder.findAll();

  for (const placeholder of customPlaceholders) {
    const regex = new RegExp(`\\{${placeholder.code}\\}`, 'g');
    content = content.replace(regex, placeholder.description);
  }

  // Replace built-in placeholders
  content = content.replace(/{user}/g, interaction.user.toString());
  content = content.replace(/{server}/g, interaction.guild.name);
  // Add more built-in placeholders as needed

  return content;
}

module.exports = {
  replacePlaceholders,
};
