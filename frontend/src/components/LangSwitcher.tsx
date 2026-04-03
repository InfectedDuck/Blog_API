'use client';

import { useLang } from '../context/LangContext';
import { LOCALE_LABELS, type Locale } from '../lib/i18n';

const locales: Locale[] = ['kz', 'ru', 'en'];

export default function LangSwitcher() {
  const { locale, setLocale } = useLang();

  return (
    <div className="flex items-center gap-0.5 bg-surface-secondary rounded-full p-0.5">
      {locales.map((l) => (
        <button
          key={l}
          onClick={() => setLocale(l)}
          className={`px-2.5 py-1 text-xs rounded-full transition ${
            locale === l
              ? 'bg-accent text-text-primary font-medium'
              : 'text-text-muted hover:text-text-secondary'
          }`}
        >
          {LOCALE_LABELS[l]}
        </button>
      ))}
    </div>
  );
}
