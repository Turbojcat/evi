const { SlashCommandBuilder } = require('@discordjs/builders');
const { createUserTable, createUser, getUserByDiscordId } = require('../../database/models/user');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('register')
    .setDescription('Register a user'),
  async execute(interaction) {
    const { user } = interaction;

    try {
      // Create the users table if it doesn't exist
      await createUserTable();

      // Check if the user is already registered
      const existingUser = await getUserByDiscordId(user.id);

      if (existingUser) {
        await interaction.reply('You are already registered!');
        return;
      }

      // Create a new user in the database
      await createUser(user.id, user.username);

      await interaction.reply('Registration successful!');
    } catch (error) {
      console.error('Error during registration:', error);
      await interaction.reply('An error occurred during registration. Please try again later.');
    }
  },
};
