import User from '../models/User.js';
import Transaction from '../models/Transaction.js';

export const adjustBalance = async ({ userId, delta, type, metadata = {} }) => {
  const numericDelta = Number(delta);
  if (!Number.isFinite(numericDelta) || numericDelta === 0) throw new Error('Invalid balance change');

  const balanceGuard = numericDelta < 0 ? { balance: { $gte: Math.abs(numericDelta) } } : {};
  const user = await User.findOneAndUpdate(
    { _id: userId, ...balanceGuard },
    { $inc: { balance: numericDelta } },
    { new: true, runValidators: true }
  );

  if (!user) {
    const exists = await User.exists({ _id: userId });
    throw new Error(exists ? 'Insufficient balance' : 'User not found');
  }

  await Transaction.create({ userId, type, amount: numericDelta, balanceAfter: user.balance, metadata });
  return user;
};
