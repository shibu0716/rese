import PlatformConfig from '../models/PlatformConfig.js';
import { adjustBalance } from './walletService.js';

const getRuntimeConfig = async () => PlatformConfig.getConfig();

export const validateStakeAgainstConfig = async (amount) => {
  const config = await getRuntimeConfig();
  const numericAmount = Number(amount);

  if (config.maintenanceMode) {
    return { ok: false, message: 'Games are temporarily paused by the owner' };
  }

  if (numericAmount < config.limits.minStake || numericAmount > config.limits.maxStake) {
    return {
      ok: false,
      message: `Stake must be between ${config.limits.minStake} and ${config.limits.maxStake} coins`
    };
  }

  return { ok: true, config };
};

export const playCoinFlip = async ({ userId, choice, amount }) => {
  const { config } = await validateStakeAgainstConfig(amount);
  await adjustBalance({ userId, delta: -amount, type: 'game_play', metadata: { game: 'coinflip', choice } });
  const result = Math.random() > 0.5 ? 'heads' : 'tails';
  const win = result === choice;

  if (win) {
    const payout = Number((amount * config.gameRates.coinFlip).toFixed(2));
    await adjustBalance({ userId, delta: payout, type: 'game_win', metadata: { game: 'coinflip', payout } });
    return { result, win, payout };
  }

  return { result, win, payout: 0 };
};

export const playDice = async ({ userId, guess, amount }) => {
  const { config } = await validateStakeAgainstConfig(amount);
  await adjustBalance({ userId, delta: -amount, type: 'game_play', metadata: { game: 'dice', guess } });
  const result = Math.floor(Math.random() * 6) + 1;
  const win = result === guess;

  if (win) {
    const payout = Number((amount * config.gameRates.dice).toFixed(2));
    await adjustBalance({ userId, delta: payout, type: 'game_win', metadata: { game: 'dice', payout } });
    return { result, win, payout };
  }

  return { result, win, payout: 0 };
};

export const resolveCrash = async ({ userId, amount, cashOutMultiplier }) => {
  const { config } = await validateStakeAgainstConfig(amount);
  await adjustBalance({ userId, delta: -amount, type: 'game_play', metadata: { game: 'crash' } });
  const crashPoint = Number((1 + Math.random() * (config.gameRates.crashMaxMultiplier - 1)).toFixed(2));
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
