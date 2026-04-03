'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

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
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-sm border border-pastel-blue p-8">
          <h1 className="text-2xl font-light text-center text-text-primary mb-8">
            create account
          </h1>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-pastel-pink text-sm text-text-secondary text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
              className="w-full px-4 py-3 rounded-xl bg-surface-secondary border-none outline-none text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-pastel-lavender transition"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-surface-secondary border-none outline-none text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-pastel-lavender transition"
            />
            <input
              type="password"
              placeholder="Password (min 6 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 rounded-xl bg-surface-secondary border-none outline-none text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-pastel-lavender transition"
            />
            <textarea
              placeholder="Bio (optional)"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full px-4 py-3 rounded-xl bg-surface-secondary border-none outline-none text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-pastel-lavender transition resize-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-pastel-lavender hover:bg-pastel-lavender-dark text-text-primary text-sm font-medium transition disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            Already have an account?{' '}
            <Link href="/login" className="text-text-secondary hover:text-text-primary transition">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
