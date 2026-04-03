'use client';

import { useState } from 'react';
import { Link2, Check, Share2 } from 'lucide-react';
import { useLang } from '../context/LangContext';

// i18n keys added inline since these are small
const SHARE_TEXT: Record<string, Record<string, string>> = {
  copy: { kz: 'Сілтемені көшіру', ru: 'Копировать ссылку', en: 'Copy link' },
  copied: { kz: 'Көшірілді!', ru: 'Скопировано!', en: 'Copied!' },
  share: { kz: 'Бөлісу', ru: 'Поделиться', en: 'Share' },
};

export default function ShareButtons({ title, slug }: { title: string; slug: string }) {
  const [copied, setCopied] = useState(false);
  const { locale } = useLang();

  const url = typeof window !== 'undefined' ? `${window.location.origin}/blog/${slug}` : '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {}
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleCopy}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition hover:bg-surface-secondary text-text-muted hover:text-text-primary"
      >
        {copied ? <Check size={16} className="text-pastel-mint-dark" /> : <Link2 size={16} />}
        <span className="text-xs">{copied ? SHARE_TEXT.copied[locale] : SHARE_TEXT.copy[locale]}</span>
      </button>

      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button
          onClick={handleNativeShare}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition hover:bg-surface-secondary text-text-muted hover:text-text-primary"
        >
          <Share2 size={16} />
          <span className="text-xs">{SHARE_TEXT.share[locale]}</span>
        </button>
      )}
    </div>
  );
}
