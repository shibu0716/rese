import Bet from '../models/Bet.js';
import Match from '../models/Match.js';
import PlatformConfig from '../models/PlatformConfig.js';
import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const oneHourAgo = () => new Date(Date.now() - 60 * 60 * 1000);

const weightedScore = ({ walletLiquidity, openBets, recentVolume, activeUsers }, weights) => {
  const totalWeight = weights.walletLiquidity + weights.openBets + weights.recentVolume + weights.activeUsers;
  if (!totalWeight) return 0;

  const total =
    walletLiquidity * weights.walletLiquidity +
    openBets * weights.openBets +
    recentVolume * weights.recentVolume +
    activeUsers * weights.activeUsers;

  return Math.round(total / totalWeight);
};

export const getOwnerPanel = async (req, res) => {
  const sinceToday = startOfToday();
  const sinceHour = oneHourAgo();

  const [config, totalUsers, activeUsers, liveMatches, openBets, todayTransactions, walletTotals, recentTransactions] =
    await Promise.all([
      PlatformConfig.getConfig(),
      User.countDocuments(),
      Transaction.distinct('userId', { createdAt: { $gte: sinceHour } }),
      Match.countDocuments({ status: 'live' }),
      Bet.countDocuments({ status: 'open' }),
      Transaction.aggregate([
        { $match: { createdAt: { $gte: sinceToday } } },
        {
          $group: {
            _id: null,
            plays: { $sum: 1 },
            coinIn: { $sum: { $cond: [{ $lt: ['$amount', 0] }, { $abs: '$amount' }, 0] } },
            coinOut: { $sum: { $cond: [{ $gt: ['$amount', 0] }, '$amount', 0] } }
          }
        }
      ]),
      User.aggregate([
        {
          $group: {
            _id: null,
            totalBalance: { $sum: '$balance' },
            averageBalance: { $avg: '$balance' }
          }
        }
      ]),
      Transaction.find().sort({ createdAt: -1 }).limit(20).populate('userId', 'username').lean()
    ]);

  const today = todayTransactions[0] || { plays: 0, coinIn: 0, coinOut: 0 };
  const wallet = walletTotals[0] || { totalBalance: 0, averageBalance: 0 };
  const activeUserCount = activeUsers.length;
  const targetUsers = config.limits.targetConcurrentUsers;
  const scores = {
    walletLiquidity: wallet.totalBalance > 0 ? Math.min(100, Math.round((wallet.totalBalance / Math.max(totalUsers, 1)) / 10)) : 0,
    openBets: Math.max(0, 100 - Math.ceil(openBets / 20)),
    recentVolume: Math.min(100, today.plays * 5),
    activeUsers: Math.min(100, Math.round((activeUserCount / targetUsers) * 100))
  };

  res.json({
    config,
    score: weightedScore(scores, config.scoreWeights),
    scores,
    capacity: {
      targetConcurrentUsers: targetUsers,
      activeUsersLastHour: activeUserCount,
      apiRateLimitPerMinute: config.limits.apiRateLimitPerMinute,
      socketUpdateMs: config.limits.socketUpdateMs
    },
    stats: {
      totalUsers,
      liveMatches,
      openBets,
      playsToday: today.plays,
      coinInToday: today.coinIn,
      coinOutToday: today.coinOut,
      totalUserBalance: wallet.totalBalance,
      averageUserBalance: Number((wallet.averageBalance || 0).toFixed(2))
    },
    recentTransactions
  });
};

export const updateOwnerSettings = async (req, res) => {
  const allowed = ['gameRates', 'limits', 'scoreWeights', 'maintenanceMode'];
  const updates = allowed.reduce((result, key) => {
    if (req.body[key] !== undefined) result[key] = req.body[key];
    return result;
  }, {});

  const config = await PlatformConfig.findOneAndUpdate(
    { key: 'default' },
    { $set: updates },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );

  res.json({ message: 'Owner settings updated', config });
};
