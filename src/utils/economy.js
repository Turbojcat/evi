// src/utils/economy.js
const { User } = require('../database/models');

async function getUserBalance(userId) {
  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      // Create a new user entry if it doesn't exist
      await User.create({
        id: userId,
        wallet: 0,
        bank: 0,
      });

      return { wallet: 0, bank: 0 };
    }

    return { wallet: user.wallet, bank: user.bank };
  } catch (error) {
    logger.error('Failed to retrieve user balance:', error);
    throw new Error('Failed to retrieve user balance');
  }
}

async function updateUserBalance(userId, amount, type, isAdmin = false) {
  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    if (type === 'wallet') {
      if (isAdmin) {
        await user.update({ wallet: amount });
      } else {
        await user.update({ wallet: user.wallet + amount });
      }
    } else if (type === 'bank') {
      if (isAdmin) {
        await user.update({ bank: amount });
      } else {
        await user.update({ bank: user.bank + amount });
      }
    } else {
      throw new Error('Invalid balance type');
    }

    return { wallet: user.wallet, bank: user.bank };
  } catch (error) {
    logger.error('Failed to update user balance:', error);
    throw new Error('Failed to update user balance');
  }
}

async function depositMoney(userId, amount) {
  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    if (amount <= 0) {
      throw new Error('Deposit amount must be greater than zero');
    }

    if (user.wallet < amount) {
      throw new Error('Insufficient funds in wallet');
    }

    await user.update({
      wallet: user.wallet - amount,
      bank: user.bank + amount,
    });

    return { wallet: user.wallet, bank: user.bank };
  } catch (error) {
    logger.error('Failed to deposit money:', error);
    throw new Error('Failed to deposit Evi :coin:');
  }
}

async function withdrawMoney(userId, amount) {
  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    if (amount <= 0) {
      throw new Error('Withdrawal amount must be greater than zero');
    }

    if (user.bank < amount) {
      throw new Error('Insufficient funds in bank');
    }

    await user.update({
      wallet: user.wallet + amount,
      bank: user.bank - amount,
    });

    return { wallet: user.wallet, bank: user.bank };
  } catch (error) {
    logger.error('Failed to withdraw money:', error);
    throw new Error('Failed to withdraw Evi :coin:');
  }
}

async function transferMoney(senderId, receiverId, amount) {
  try {
    const sender = await User.findOne({ where: { id: senderId } });
    const receiver = await User.findOne({ where: { id: receiverId } });

    if (!sender || !receiver) {
      throw new Error('Sender or receiver not found');
    }

    if (amount <= 0) {
      throw new Error('Transfer amount must be greater than zero');
    }

    if (sender.wallet < amount) {
      throw new Error('Insufficient funds in sender\'s wallet');
    }

    await sender.update({ wallet: sender.wallet - amount });
    await receiver.update({ wallet: receiver.wallet + amount });

    return { senderWallet: sender.wallet, receiverWallet: receiver.wallet };
  } catch (error) {
    logger.error('Failed to transfer money:', error);
    throw new Error('Failed to transfer Evi :coin:');
  }
}

async function getUserInventory(userId) {
  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    return user.inventory;
  } catch (error) {
    logger.error('Failed to retrieve user inventory:', error);
    throw new Error('Failed to retrieve user inventory');
  }
}

async function updateUserInventory(userId, itemId, quantity) {
  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error('User not found');
    }

    const inventory = user.inventory;
    inventory[itemId] = (inventory[itemId] || 0) + quantity;

    await user.update({ inventory });

    return inventory;
  } catch (error) {
    logger.error('Failed to update user inventory:', error);
    throw new Error('Failed to update user inventory');
  }
}

module.exports = {
  getUserBalance,
  updateUserBalance,
  depositMoney,
  withdrawMoney,
  transferMoney,
  getUserInventory,
  updateUserInventory,
};
