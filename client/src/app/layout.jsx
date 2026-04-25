import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import Link from 'next/link';

export const metadata = {
  title: 'PlaySim Arena',
  description: 'Virtual coin sports trading and mini-games platform'
};

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body>
        <AuthProvider>
          <header className='border-b border-white/10 bg-black/30 backdrop-blur sticky top-0 z-50'>
            <nav className='max-w-6xl mx-auto px-4 py-3 flex gap-4 items-center'>
              <Link href='/' className='font-bold text-accent'>PlaySim Arena</Link>
              <Link href='/games'>Games</Link>
              <Link href='/wallet'>Wallet</Link>
              <Link href='/auth/login' className='ml-auto'>Login</Link>
              <Link href='/auth/register'>Register</Link>
            </nav>
          </header>
          <main className='max-w-6xl mx-auto p-4'>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
