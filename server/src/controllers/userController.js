import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import Bet from '../models/Bet.js';

export const getProfile = async (req, res) => {
  const user = await User.findById(req.user.id).select('username balance createdAt');
  res.json(user);
};

export const getHistory = async (req, res) => {
  const [transactions, bets] = await Promise.all([
    Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 }).limit(100),
    Bet.find({ userId: req.user.id }).populate('matchId').sort({ createdAt: -1 }).limit(100)
  ]);

  res.json({ transactions, bets });
};
