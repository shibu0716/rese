import { validateAmount, validateRequired } from '../middleware/validateRequest.js';
import { playCoinFlip, playDice, resolveCrash, validateStakeAgainstConfig } from '../services/gameService.js';

const validateStake = async (amount, res) => {
  if (!validateAmount(amount)) {
    res.status(400).json({ message: 'Invalid amount' });
    return false;
  }

  const stakeCheck = await validateStakeAgainstConfig(Number(amount));
  if (!stakeCheck.ok) {
    res.status(400).json({ message: stakeCheck.message });
    return false;
  }

  return true;
};

export const coinFlip = async (req, res) => {
  try {
    const { choice, amount } = req.body;
    if (!validateRequired(['choice', 'amount'], req.body)) return res.status(400).json({ message: 'Missing fields' });
    if (!['heads', 'tails'].includes(choice)) return res.status(400).json({ message: 'Invalid choice' });
    if (!(await validateStake(amount, res))) return;

    const result = await playCoinFlip({ userId: req.user.id, choice, amount: Number(amount) });
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Game failed' });
  }
};

export const dice = async (req, res) => {
  try {
    const { guess, amount } = req.body;
    if (!validateRequired(['guess', 'amount'], req.body)) return res.status(400).json({ message: 'Missing fields' });
    if (![1, 2, 3, 4, 5, 6].includes(Number(guess))) return res.status(400).json({ message: 'Invalid guess' });
    if (!(await validateStake(amount, res))) return;

    const result = await playDice({ userId: req.user.id, guess: Number(guess), amount: Number(amount) });
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Game failed' });
  }
};

export const crash = async (req, res) => {
  try {
    const { amount, cashOutMultiplier } = req.body;
    if (!validateRequired(['amount', 'cashOutMultiplier'], req.body)) return res.status(400).json({ message: 'Missing fields' });
    if (!validateAmount(amount) || Number(cashOutMultiplier) <= 1) return res.status(400).json({ message: 'Invalid inputs' });
    if (!(await validateStake(amount, res))) return;

    const result = await resolveCrash({ userId: req.user.id, amount: Number(amount), cashOutMultiplier: Number(cashOutMultiplier) });
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message || 'Game failed' });
  }
};
