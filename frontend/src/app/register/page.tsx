'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import Logo from '../../components/Logo';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({ email, username, password, bio: bio || undefined });
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Тіркелу сәтсіз аяқталды');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <Logo size="md" />
        </div>
        <div className="bg-surface-secondary rounded-2xl shadow-sm border border-surface-tertiary p-8">
          <h1 className="text-2xl font-light text-center text-text-primary mb-8">
            Аккаунт құру
          </h1>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-pastel-pink text-sm text-text-secondary text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Пайдаланушы аты — Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              className="w-full px-4 py-3 rounded-xl bg-surface border-none outline-none text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-accent transition"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-surface border-none outline-none text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-accent transition"
            />
            <input
              type="password"
              placeholder="Құпия сөз — Password (мин. 6)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-surface border-none outline-none text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-accent transition"
            />
            <textarea
              placeholder="Өзіңіз туралы — Bio (міндетті емес)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-surface border-none outline-none text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-accent transition resize-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-accent hover:bg-accent-dark text-text-primary text-sm font-medium transition disabled:opacity-50"
            >
              {loading ? 'Тіркелуде...' : 'Тіркелу — Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Аккаунтыңыз бар ма?{' '}
            <Link href="/login" className="text-text-secondary hover:text-text-primary transition">
              Кіру
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
