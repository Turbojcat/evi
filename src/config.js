require('dotenv').config();

module.exports = {
  PREFIX: process.env.PREFIX,
  OWNER_ID: process.env.OWNER_ID,
  TOKEN: process.env.DISCORD_TOKEN,
  DATABASE: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
};
