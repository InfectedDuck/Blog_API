'use client';

import Link from 'next/link';
import Logo from '../components/Logo';
import { useLang } from '../context/LangContext';

export default function NotFound() {
  const { t } = useLang();

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center">
        <Logo size="lg" className="justify-center mb-8 opacity-30" />
        <h1 className="text-6xl font-light text-text-primary mb-4">404</h1>
        <p className="text-lg text-text-muted mb-8">{t('404.title')}</p>
        <Link href="/" className="px-6 py-3 rounded-xl bg-accent hover:bg-accent-dark text-sm font-medium text-text-primary transition">
          {t('404.home')}
        </Link>
      </div>
    </div>
  );
}
