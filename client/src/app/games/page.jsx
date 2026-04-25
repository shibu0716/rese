'use client';

import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function GamesPage() {
  const [amount, setAmount] = useState(10);
  const [coinChoice, setCoinChoice] = useState('heads');
  const [diceGuess, setDiceGuess] = useState(1);
  const [crashMultiplier, setCrashMultiplier] = useState(1.5);
  const [liveMultiplier, setLiveMultiplier] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveMultiplier((m) => Number((m + 0.05).toFixed(2)));
    }, 150);
    return () => clearInterval(timer);
  }, []);

  const play = async (path, payload) => {
    try {
      const { data } = await api.post(path, payload);
      setMessage(JSON.stringify(data));
    } catch (e) {
      setMessage(e.response?.data?.message || 'Game failed');
    }
  };

  return (
    <section className='space-y-4'>
      <h1 className='text-3xl font-bold'>Mini Games (Demo Coins)</h1>
      <div className='grid md:grid-cols-3 gap-4'>
        <div className='card space-y-2'>
          <h2 className='font-semibold'>Coin Flip</h2>
          <select className='w-full bg-black/20 p-2 rounded' value={coinChoice} onChange={(e) => setCoinChoice(e.target.value)}>
            <option value='heads'>Heads</option>
            <option value='tails'>Tails</option>
          </select>
          <button className='btn w-full' onClick={() => play('/api/game/coinflip', { choice: coinChoice, amount: Number(amount) })}>Play (2x)</button>
        </div>

        <div className='card space-y-2'>
          <h2 className='font-semibold'>Dice Roll</h2>
          <input className='w-full bg-black/20 p-2 rounded' type='number' min='1' max='6' value={diceGuess} onChange={(e) => setDiceGuess(Number(e.target.value))} />
          <button className='btn w-full' onClick={() => play('/api/game/dice', { guess: Number(diceGuess), amount: Number(amount) })}>Roll (5x)</button>
        </div>

        <div className='card space-y-2'>
          <h2 className='font-semibold'>Crash Simulator</h2>
          <p className='text-xl font-mono text-accent transition-all'>x{liveMultiplier}</p>
          <input className='w-full bg-black/20 p-2 rounded' type='number' min='1.01' step='0.01' value={crashMultiplier} onChange={(e) => setCrashMultiplier(Number(e.target.value))} />
          <button className='btn w-full' onClick={() => play('/api/game/crash', { cashOutMultiplier: Number(crashMultiplier), amount: Number(amount) })}>Cash Out</button>
        </div>
      </div>

      <div className='card'>
        <label className='block'>
          Stake Amount
          <input className='w-full bg-black/20 p-2 rounded' type='number' min='1' value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
      </div>

      {message && <pre className='card overflow-auto text-xs'>{message}</pre>}
    </section>
  );
}
