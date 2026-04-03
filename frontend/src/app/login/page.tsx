'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { useLang } from '../../context/LangContext';
import Logo from '../../components/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { t } = useLang();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Error');
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
          <h1 className="text-2xl font-light text-center text-text-primary mb-8">{t('login.title')}</h1>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-pastel-pink text-sm text-text-secondary text-center">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <input type="email" placeholder={t('login.email')} value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-surface border-none outline-none text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-accent transition" />
            <input type="password" placeholder={t('login.password')} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-3 rounded-xl bg-surface border-none outline-none text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-accent transition" />
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-accent hover:bg-accent-dark text-text-primary text-sm font-medium transition disabled:opacity-50">
              {loading ? t('login.submitting') : t('login.submit')}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-text-muted">
            {t('login.noAccount')}{' '}
            <Link href="/register" className="text-text-secondary hover:text-text-primary transition">{t('login.signUp')}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
