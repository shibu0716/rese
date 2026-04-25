'use client';

import { useEffect, useMemo, useState } from 'react';
import api from '../../lib/api';

const numberValue = (value) => Number(value || 0);

export default function OwnerPanelPage() {
  const [panel, setPanel] = useState(null);
  const [settings, setSettings] = useState(null);
  const [message, setMessage] = useState('');

  const scoreColor = useMemo(() => {
    const score = panel?.score || 0;
    if (score >= 80) return 'text-emerald-300';
    if (score >= 55) return 'text-yellow-300';
    return 'text-red-300';
  }, [panel]);

  const loadPanel = async () => {
    try {
      const { data } = await api.get('/api/owner/panel');
      setPanel(data);
      setSettings(data.config);
      setMessage('');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Owner panel unavailable');
    }
  };

  useEffect(() => {
    loadPanel();
  }, []);

  const updateNested = (section, key, value) => {
    setSettings((current) => ({
      ...current,
      [section]: {
        ...current[section],
        [key]: value
      }
    }));
  };

  const saveSettings = async () => {
    try {
      const payload = {
        gameRates: {
          coinFlip: numberValue(settings.gameRates.coinFlip),
          dice: numberValue(settings.gameRates.dice),
          crashMaxMultiplier: numberValue(settings.gameRates.crashMaxMultiplier)
        },
        limits: {
          minStake: numberValue(settings.limits.minStake),
          maxStake: numberValue(settings.limits.maxStake),
          apiRateLimitPerMinute: numberValue(settings.limits.apiRateLimitPerMinute),
          socketUpdateMs: numberValue(settings.limits.socketUpdateMs),
          targetConcurrentUsers: numberValue(settings.limits.targetConcurrentUsers)
        },
        scoreWeights: {
          walletLiquidity: numberValue(settings.scoreWeights.walletLiquidity),
          openBets: numberValue(settings.scoreWeights.openBets),
          recentVolume: numberValue(settings.scoreWeights.recentVolume),
          activeUsers: numberValue(settings.scoreWeights.activeUsers)
        },
        maintenanceMode: Boolean(settings.maintenanceMode)
      };

      const { data } = await api.put('/api/owner/settings', payload);
      setSettings(data.config);
      setMessage('Settings saved');
      loadPanel();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to save settings');
    }
  };

  if (!panel || !settings) {
    return (
      <section className='space-y-4'>
        <h1 className='text-3xl font-bold'>Owner Panel</h1>
        <div className='card'>{message || 'Loading owner controls...'}</div>
      </section>
    );
  }

  const statCards = [
    ['Users', panel.stats.totalUsers],
    ['Live Matches', panel.stats.liveMatches],
    ['Open Bets', panel.stats.openBets],
    ['Plays Today', panel.stats.playsToday],
    ['Coins In Today', panel.stats.coinInToday],
    ['Coins Out Today', panel.stats.coinOutToday],
    ['Total Balance', panel.stats.totalUserBalance],
    ['Avg Balance', panel.stats.averageUserBalance]
  ];

  return (
    <section className='space-y-6'>
      <div className='flex flex-wrap items-end justify-between gap-3'>
        <div>
          <h1 className='text-3xl font-bold'>Owner Panel</h1>
          <p className='text-white/60'>Rates, scores, traffic limits, and live game health.</p>
        </div>
        <button className='btn' onClick={saveSettings}>Save Controls</button>
      </div>

      {message && <div className='card text-sm text-accent'>{message}</div>}

      <div className='grid gap-4 lg:grid-cols-[1fr_2fr]'>
        <div className='card'>
          <p className='text-white/60'>Platform Score</p>
          <div className={`mt-2 text-6xl font-black ${scoreColor}`}>{panel.score}</div>
          <div className='mt-4 grid grid-cols-2 gap-2 text-sm'>
            {Object.entries(panel.scores).map(([key, value]) => (
              <div key={key} className='rounded-lg bg-black/20 p-3'>
                <p className='capitalize text-white/60'>{key.replace(/([A-Z])/g, ' $1')}</p>
                <p className='text-xl font-semibold'>{value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
          {statCards.map(([label, value]) => (
            <div key={label} className='card'>
              <p className='text-sm text-white/60'>{label}</p>
              <p className='mt-2 text-2xl font-bold'>{value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className='grid gap-4 lg:grid-cols-3'>
        <div className='card space-y-3'>
          <h2 className='text-xl font-semibold'>Game Rates</h2>
          <label className='block text-sm text-white/70'>Coin Flip Payout
            <input className='mt-1 w-full rounded bg-black/20 p-2 text-white' type='number' step='0.1' value={settings.gameRates.coinFlip} onChange={(e) => updateNested('gameRates', 'coinFlip', e.target.value)} />
          </label>
          <label className='block text-sm text-white/70'>Dice Payout
            <input className='mt-1 w-full rounded bg-black/20 p-2 text-white' type='number' step='0.1' value={settings.gameRates.dice} onChange={(e) => updateNested('gameRates', 'dice', e.target.value)} />
          </label>
          <label className='block text-sm text-white/70'>Crash Max Multiplier
            <input className='mt-1 w-full rounded bg-black/20 p-2 text-white' type='number' step='0.1' value={settings.gameRates.crashMaxMultiplier} onChange={(e) => updateNested('gameRates', 'crashMaxMultiplier', e.target.value)} />
          </label>
        </div>

        <div className='card space-y-3'>
          <h2 className='text-xl font-semibold'>Traffic Limits</h2>
          <label className='block text-sm text-white/70'>Min Stake
            <input className='mt-1 w-full rounded bg-black/20 p-2 text-white' type='number' value={settings.limits.minStake} onChange={(e) => updateNested('limits', 'minStake', e.target.value)} />
          </label>
          <label className='block text-sm text-white/70'>Max Stake
            <input className='mt-1 w-full rounded bg-black/20 p-2 text-white' type='number' value={settings.limits.maxStake} onChange={(e) => updateNested('limits', 'maxStake', e.target.value)} />
          </label>
          <label className='block text-sm text-white/70'>API Requests Per Minute
            <input className='mt-1 w-full rounded bg-black/20 p-2 text-white' type='number' value={settings.limits.apiRateLimitPerMinute} onChange={(e) => updateNested('limits', 'apiRateLimitPerMinute', e.target.value)} />
          </label>
          <label className='block text-sm text-white/70'>Socket Update MS
            <input className='mt-1 w-full rounded bg-black/20 p-2 text-white' type='number' value={settings.limits.socketUpdateMs} onChange={(e) => updateNested('limits', 'socketUpdateMs', e.target.value)} />
          </label>
          <label className='block text-sm text-white/70'>Target Concurrent Users
            <input className='mt-1 w-full rounded bg-black/20 p-2 text-white' type='number' value={settings.limits.targetConcurrentUsers} onChange={(e) => updateNested('limits', 'targetConcurrentUsers', e.target.value)} />
          </label>
          <label className='flex items-center gap-2 text-sm text-white/80'>
            <input type='checkbox' checked={settings.maintenanceMode} onChange={(e) => setSettings((current) => ({ ...current, maintenanceMode: e.target.checked }))} />
            Maintenance mode
          </label>
        </div>

        <div className='card space-y-3'>
          <h2 className='text-xl font-semibold'>Score Weights</h2>
          {Object.entries(settings.scoreWeights).map(([key, value]) => (
            <label key={key} className='block text-sm capitalize text-white/70'>{key.replace(/([A-Z])/g, ' $1')}
              <input className='mt-1 w-full rounded bg-black/20 p-2 text-white' type='number' value={value} onChange={(e) => updateNested('scoreWeights', key, e.target.value)} />
            </label>
          ))}
        </div>
      </div>

      <div className='card overflow-x-auto'>
        <h2 className='mb-3 text-xl font-semibold'>Recent Transactions</h2>
        <table className='w-full min-w-[680px] text-sm'>
          <thead className='text-left text-white/60'>
            <tr>
              <th className='p-2'>User</th>
              <th className='p-2'>Type</th>
              <th className='p-2'>Amount</th>
              <th className='p-2'>Balance After</th>
              <th className='p-2'>Time</th>
            </tr>
          </thead>
          <tbody>
            {panel.recentTransactions.map((item) => (
              <tr key={item._id} className='border-t border-white/10'>
                <td className='p-2'>{item.userId?.username || 'Unknown'}</td>
                <td className='p-2'>{item.type}</td>
                <td className='p-2'>{item.amount}</td>
                <td className='p-2'>{item.balanceAfter}</td>
                <td className='p-2'>{new Date(item.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
