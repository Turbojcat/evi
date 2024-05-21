require('dotenv').config();

module.exports = {
  PREFIX: '!',
  TOKEN: process.env.DISCORD_TOKEN,
  OWNER_ID: process.env.OWNER_ID,
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  CLIENT_ID: process.env.CLIENT_ID,
  GUILD_ID: process.env.GUILD_ID,
  PREMIUM_ROLE_ID: process.env.PREMIUM_ROLE_ID,
};
