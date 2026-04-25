import PlatformConfig from '../models/PlatformConfig.js';
import { updateLiveOdds, settleOneLiveMatch } from '../services/matchService.js';

export const setupSimulationEngine = (io) => {
  const scheduleOddsUpdate = async () => {
    try {
      const updated = await updateLiveOdds();
      io.emit('oddsUpdate', updated);
    } catch (error) {
      console.error('Odds update failed:', error.message);
    } finally {
      const config = await PlatformConfig.getConfig();
      setTimeout(scheduleOddsUpdate, config.limits.socketUpdateMs);
    }
  };

  scheduleOddsUpdate();

  setInterval(async () => {
    try {
      const ended = await settleOneLiveMatch();
      if (ended) io.emit('matchResult', ended);
    } catch (error) {
      console.error('Match settlement failed:', error.message);
    }
  }, Number(process.env.MATCH_SETTLE_INTERVAL_MS || 180000));
};
