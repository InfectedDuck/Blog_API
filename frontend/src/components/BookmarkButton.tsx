'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { toggleBookmark, checkBookmark } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';

export default function BookmarkButton({ postId }: { postId: number }) {
  const [bookmarked, setBookmarked] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { t } = useLang();

  useEffect(() => {
    if (!user) return;
    checkBookmark(postId).then((res) => setBookmarked(res.bookmarked)).catch(() => {});
  }, [postId, user]);

  if (!user) return null;

  const handleToggle = async () => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await toggleBookmark(postId);
      setBookmarked(res.bookmarked);
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition hover:bg-surface-secondary"
      title={bookmarked ? t('bookmark.saved') : t('bookmark.save')}
    >
      <Bookmark
        size={18}
        className={`transition ${bookmarked ? 'fill-accent stroke-accent' : 'fill-none stroke-text-muted'}`}
      />
      <span className="text-xs text-text-muted">{bookmarked ? t('bookmark.saved') : t('bookmark.save')}</span>
    </button>
  );
}
