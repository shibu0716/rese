'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext';

export default function RegisterPage() {
  const [form, setForm] = useState({ username: '', password: '', ownerSetupCode: '' });
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        username: form.username,
        password: form.password,
        ...(form.ownerSetupCode ? { ownerSetupCode: form.ownerSetupCode } : {})
      };
      const { data } = await api.post('/api/auth/register', payload);
      login(data.token);
      router.push(data.user?.role === 'owner' ? '/owner' : '/wallet');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form className='card max-w-md mx-auto space-y-3' onSubmit={submit}>
      <h1 className='text-xl font-bold'>Register</h1>
      <input className='w-full p-2 rounded bg-black/20' placeholder='Username' value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
      <input className='w-full p-2 rounded bg-black/20' type='password' placeholder='Password' value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <input className='w-full p-2 rounded bg-black/20' type='password' placeholder='Owner setup code' value={form.ownerSetupCode} onChange={(e) => setForm({ ...form, ownerSetupCode: e.target.value })} />
      {error && <p className='text-red-400 text-sm'>{error}</p>}
      <button className='btn w-full'>Register</button>
    </form>
  );
}
