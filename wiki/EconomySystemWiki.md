Economy System Wiki
Welcome to the wiki documentation for the Economy System! This document provides an overview of the features, commands, and setup instructions for the economy system in your Discord bot.

Table of Contents
Introduction
Features
Setup
Commands
Admin Commands
User Commands
Database Models
Utility Functions
Event Handlers
Leaderboard
Cooldowns
Error Handling
Contributing
Introduction
The Economy System is a feature-rich module that allows users to earn, manage, and transfer virtual currency within your Discord bot. It provides a range of commands and functionalities to enhance user engagement and interaction.

Features
Wallet and bank accounts for users
Deposit and withdraw currency
Transfer currency between users
User inventory management
Daily, weekly, and monthly streak rewards
Admin commands for managing user balances
Leaderboard to display top users by balance
Setup
To set up the Economy System in your Discord bot, follow these steps:

Ensure you have the necessary dependencies installed, including discord.js, sequelize, and mysql2.
Configure the database connection in src/database/connection.js by providing the appropriate database credentials.
Run the bot and ensure the database connection is established successfully.
Commands
Admin Commands
/setbalance <user> <amount> <type>: Set the balance of a user's wallet or bank account.
/addbalance <user> <amount> <type>: Add currency to a user's wallet or bank account.
/removebalance <user> <amount> <type>: Remove currency from a user's wallet or bank account.
User Commands
/balance: Check your own wallet and bank balance.
/deposit <amount>: Deposit currency from your wallet to your bank account.
/withdraw <amount>: Withdraw currency from your bank account to your wallet.
/transfer <user> <amount>: Transfer currency from your wallet to another user's wallet.
/inventory: View your inventory of items.
Database Models
The Economy System utilizes the following database models:

User: Represents a user and stores their economy-related data, such as balances, inventory, and streaks.
Utility Functions
The src/utils/economy.js file contains utility functions for managing user balances and inventory. These functions include:

getUserBalance: Retrieve a user's wallet and bank balance.
updateUserBalance: Update a user's wallet or bank balance.
depositMoney: Transfer currency from a user's wallet to their bank account.
withdrawMoney: Transfer currency from a user's bank account to their wallet.
transferMoney: Transfer currency from one user's wallet to another user's wallet.
getUserInventory: Retrieve a user's inventory.
updateUserInventory: Update a user's inventory by adding or removing items.