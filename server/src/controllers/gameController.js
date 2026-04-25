import { validateAmount, validateRequired } from '../middleware/validateRequest.js';
import { playCoinFlip, playDice, resolveCrash } from '../services/gameService.js';

export const coinFlip = async (req, res) => {
  const { choice, amount } = req.body;
  if (!validateRequired(['choice', 'amount'], req.body)) return res.status(400).json({ message: 'Missing fields' });
  if (!['heads', 'tails'].includes(choice)) return res.status(400).json({ message: 'Invalid choice' });
  if (!validateAmount(amount)) return res.status(400).json({ message: 'Invalid amount' });

  const result = await playCoinFlip({ userId: req.user.id, choice, amount: Number(amount) });
  res.json(result);
};

export const dice = async (req, res) => {
  const { guess, amount } = req.body;
  if (!validateRequired(['guess', 'amount'], req.body)) return res.status(400).json({ message: 'Missing fields' });
  if (![1, 2, 3, 4, 5, 6].includes(Number(guess))) return res.status(400).json({ message: 'Invalid guess' });
  if (!validateAmount(amount)) return res.status(400).json({ message: 'Invalid amount' });

  const result = await playDice({ userId: req.user.id, guess: Number(guess), amount: Number(amount) });
  res.json(result);
};

export const crash = async (req, res) => {
  const { amount, cashOutMultiplier } = req.body;
  if (!validateRequired(['amount', 'cashOutMultiplier'], req.body)) return res.status(400).json({ message: 'Missing fields' });
  if (!validateAmount(amount) || Number(cashOutMultiplier) <= 1) return res.status(400).json({ message: 'Invalid inputs' });

  const result = await resolveCrash({ userId: req.user.id, amount: Number(amount), cashOutMultiplier: Number(cashOutMultiplier) });
  res.json(result);
};
