'use client';

import { useEffect, useState } from 'react';
import api from '../lib/api';
import { socket } from '../lib/socket';
import MatchCard from '../components/MatchCard';

export default function HomePage() {
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/api/matches').then((res) => setMatches(res.data)).catch(() => setError('Failed to load matches'));

    const onOdds = (payload) => {
      setMatches((prev) => prev.map((m) => payload.find((u) => u._id === m._id) || m));
    };
    const onResult = (result) => {
      setMatches((prev) => prev.map((m) => (m._id === result._id ? result : m)));
    };

    socket.on('oddsUpdate', onOdds);
    socket.on('matchResult', onResult);
    return () => {
      socket.off('oddsUpdate', onOdds);
      socket.off('matchResult', onResult);
    };
  }, []);

  return (
    <section className='space-y-4'>
      <h1 className='text-3xl font-bold'>Live Sports Trading (Virtual Coins)</h1>
      {error && <p className='text-red-400'>{error}</p>}
      <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {matches.map((match) => <MatchCard key={match._id} match={match} />)}
      </div>
    </section>
  );
}
