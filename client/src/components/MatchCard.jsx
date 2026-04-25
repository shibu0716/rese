'use client';

import Link from 'next/link';

export default function MatchCard({ match }) {
  return (
    <div className='card space-y-3'>
      <div className='flex justify-between items-center'>
        <h3 className='font-semibold'>{match.teamA} vs {match.teamB}</h3>
        <span className={`text-xs px-2 py-1 rounded ${match.status === 'live' ? 'bg-green-700' : 'bg-gray-700'}`}>{match.status}</span>
      </div>
      <div className='grid grid-cols-2 gap-2 text-sm'>
        <div className='bg-white/5 p-2 rounded'>
          {match.teamA} <strong>@ {match.oddsA}</strong>
        </div>
        <div className='bg-white/5 p-2 rounded'>
          {match.teamB} <strong>@ {match.oddsB}</strong>
        </div>
      </div>
      <Link href={`/matches/${match._id}`} className='btn inline-block text-center w-full'>Open Match</Link>
    </div>
  );
}
