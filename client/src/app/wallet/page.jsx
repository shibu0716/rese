'use client';

import { useEffect, useState } from 'react';
import api from '../../lib/api';

export default function WalletPage() {
  const [profile, setProfile] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.get('/api/user/profile'), api.get('/api/user/history')])
      .then(([profileRes, historyRes]) => {
        setProfile(profileRes.data);
        setHistory(historyRes.data.transactions);
      })
      .catch((e) => setError(e.response?.data?.message || 'Load wallet failed'));
  }, []);

  return (
    <section className='space-y-4'>
      <h1 className='text-3xl font-bold'>Wallet</h1>
      {error && <p className='text-red-400'>{error}</p>}
      {profile && (
        <div className='card'>
          <p>User: <strong>{profile.username}</strong></p>
          <p>Balance: <strong>{profile.balance.toFixed(2)} coins</strong></p>
          <p>Joined: {new Date(profile.createdAt).toLocaleString()}</p>
        </div>
      )}
      <div className='card'>
        <h2 className='font-semibold mb-3'>Recent Transactions</h2>
        <div className='space-y-2 max-h-96 overflow-y-auto'>
          {history.map((txn) => (
            <div key={txn._id} className='p-2 rounded bg-white/5 text-sm flex justify-between'>
              <span>{txn.type}</span>
              <span className={txn.amount >= 0 ? 'text-green-400' : 'text-red-400'}>{txn.amount.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
