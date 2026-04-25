import { updateLiveOdds, settleOneLiveMatch } from '../services/matchService.js';

export const setupSimulationEngine = (io) => {
  setInterval(async () => {
    const updated = await updateLiveOdds();
    io.emit('oddsUpdate', updated);
  }, 3000);

  setInterval(async () => {
    const ended = await settleOneLiveMatch();
    if (ended) io.emit('matchResult', ended);
  }, Number(process.env.MATCH_SETTLE_INTERVAL_MS || 180000));
};
