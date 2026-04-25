import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const adjustBalance = async ({ userId, delta, type, metadata = {} }) => {
  const user = await User.findById(userId);
  if (!user) throw new Error('User not found');

  const newBalance = user.balance + delta;
  if (newBalance < 0) throw new Error('Insufficient balance');

  user.balance = newBalance;
  await user.save();

  await Transaction.create({ userId, type, amount: delta, balanceAfter: newBalance, metadata });
  return user;
};
