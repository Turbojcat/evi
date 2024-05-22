// src/database/userFunctions.js
const { User } = require('./models');

async function createUser(discordId, username) {
  try {
    const user = await User.create({
      discordId,
      username,
    });

    console.log('User created successfully');
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
}

async function getUserByDiscordId(discordId) {
  try {
    const user = await User.findOne({
      where: {
        discordId,
      },
    });

    return user;
  } catch (error) {
    console.error('Error retrieving user:', error);
    throw error;
  }
}

module.exports = {
  createUser,
  getUserByDiscordId,
};