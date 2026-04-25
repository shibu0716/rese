'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '../../../lib/api';

export default function MatchDetailPage() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [team, setTeam] = useState('teamA');
  const [amount, setAmount] = useState(10);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.get('/api/matches').then((res) => setMatch(res.data.find((m) => m._id === id)));
  }, [id]);

  const placeBet = async () => {
    try {
      await api.post('/api/bet', { matchId: id, team, amount: Number(amount) });
      setMessage('Bet placed successfully');
    } catch (e) {
      setMessage(e.response?.data?.message || 'Bet failed');
    }
  };

  if (!match) return <p>Loading...</p>;

  return (
    <div className='card space-y-4'>
      <h1 className='text-2xl font-bold'>{match.teamA} vs {match.teamB}</h1>
      <p>Status: {match.status}</p>
      <div className='space-y-2'>
        <label className='block'>
          Team
          <select className='w-full bg-black/20 p-2 rounded' value={team} onChange={(e) => setTeam(e.target.value)}>
            <option value='teamA'>{match.teamA} @ {match.oddsA}</option>
            <option value='teamB'>{match.teamB} @ {match.oddsB}</option>
          </select>
        </label>
        <label className='block'>
          Amount
          <input className='w-full bg-black/20 p-2 rounded' type='number' min='1' value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
        <button className='btn' onClick={placeBet}>Place Virtual Bet</button>
        {message && <p className='text-sm text-accent'>{message}</p>}
      </div>
    </div>
  );
}
