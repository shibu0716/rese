import Match from '../models/Match.js';
import Bet from '../models/Bet.js';
import { validateAmount, validateRequired } from '../middleware/validateRequest.js';
import { adjustBalance } from '../services/walletService.js';

export const placeBet = async (req, res) => {
  const { matchId, team, amount } = req.body;
  if (!validateRequired(['matchId', 'team', 'amount'], req.body)) return res.status(400).json({ message: 'Missing fields' });
  if (!['teamA', 'teamB'].includes(team)) return res.status(400).json({ message: 'Invalid team' });
  if (!validateAmount(amount)) return res.status(400).json({ message: 'Invalid amount' });

  const match = await Match.findById(matchId);
  if (!match || match.status !== 'live') return res.status(400).json({ message: 'Match not live' });

  const odds = team === 'teamA' ? match.oddsA : match.oddsB;
  await adjustBalance({ userId: req.user.id, delta: -Number(amount), type: 'bet_place', metadata: { matchId, team, odds } });

  const bet = await Bet.create({ userId: req.user.id, matchId, team, amount: Number(amount), odds, status: 'open' });
  res.status(201).json(bet);
};
