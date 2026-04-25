import Match from '../models/Match.js';
import Bet from '../models/Bet.js';
import { adjustBalance } from './walletService.js';

const teams = [
  ['Falcons', 'Tigers'],
  ['Sharks', 'Wolves'],
  ['Titans', 'Eagles'],
  ['Comets', 'Raptors']
];

const randomOdds = () => Number((1.2 + Math.random() * 2.5).toFixed(2));

export const seedMatchesIfEmpty = async () => {
  const count = await Match.countDocuments();
  if (count > 0) return;
  await Match.insertMany(
    teams.map(([teamA, teamB]) => ({ teamA, teamB, oddsA: randomOdds(), oddsB: randomOdds(), status: 'live' }))
  );
};

export const updateLiveOdds = async () => {
  const liveMatches = await Match.find({ status: 'live' }).lean();
  if (!liveMatches.length) return [];

  const updated = liveMatches.map((match) => ({
    ...match,
    oddsA: randomOdds(),
    oddsB: randomOdds()
  }));

  await Match.bulkWrite(
    updated.map((match) => ({
      updateOne: {
        filter: { _id: match._id, status: 'live' },
        update: { $set: { oddsA: match.oddsA, oddsB: match.oddsB } }
      }
    })),
    { ordered: false }
  );

  return updated;
};

export const settleOneLiveMatch = async () => {
  const match = await Match.findOne({ status: 'live' }).sort({ createdAt: 1 });
  if (!match) return null;

  const winner = Math.random() > 0.5 ? 'teamA' : 'teamB';
  match.status = 'ended';
  match.result = winner;
  await match.save();

  const bets = await Bet.find({ matchId: match._id, status: 'open' });
  for (const bet of bets) {
    const won = bet.team === winner;
    bet.status = won ? 'won' : 'lost';
    await bet.save();

    if (won) {
      const payout = Number((bet.amount * bet.odds).toFixed(2));
      await adjustBalance({
        userId: bet.userId,
        delta: payout,
        type: 'bet_win',
        metadata: { betId: bet._id, matchId: match._id, payout }
      });
    }
  }

  return match;
};
