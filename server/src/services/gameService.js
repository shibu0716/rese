import { adjustBalance } from './walletService.js';

export const playCoinFlip = async ({ userId, choice, amount }) => {
  await adjustBalance({ userId, delta: -amount, type: 'game_play', metadata: { game: 'coinflip', choice } });
  const result = Math.random() > 0.5 ? 'heads' : 'tails';
  const win = result === choice;

  if (win) {
    const payout = amount * 2;
    await adjustBalance({ userId, delta: payout, type: 'game_win', metadata: { game: 'coinflip', payout } });
  }

  return { result, win, payout: win ? amount * 2 : 0 };
};

export const playDice = async ({ userId, guess, amount }) => {
  await adjustBalance({ userId, delta: -amount, type: 'game_play', metadata: { game: 'dice', guess } });
  const result = Math.floor(Math.random() * 6) + 1;
  const win = result === guess;

  if (win) {
    const payout = amount * 5;
    await adjustBalance({ userId, delta: payout, type: 'game_win', metadata: { game: 'dice', payout } });
  }

  return { result, win, payout: win ? amount * 5 : 0 };
};

export const resolveCrash = async ({ userId, amount, cashOutMultiplier }) => {
  await adjustBalance({ userId, delta: -amount, type: 'game_play', metadata: { game: 'crash' } });
  const crashPoint = Number((1 + Math.random() * 5).toFixed(2));
  const won = cashOutMultiplier > 1 && cashOutMultiplier <= crashPoint;

  if (won) {
    const payout = Number((amount * cashOutMultiplier).toFixed(2));
    await adjustBalance({
      userId,
      delta: payout,
      type: 'game_cashout',
      metadata: { game: 'crash', crashPoint, cashOutMultiplier, payout }
    });
    return { won: true, crashPoint, payout };
  }

  return { won: false, crashPoint, payout: 0 };
};
