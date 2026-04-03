'use client';

import { useState, useEffect } from 'react';
import { getBookmarks, type Post } from '../../lib/api';
import { useLang } from '../../context/LangContext';
import AuthGuard from '../../components/AuthGuard';
import PostCard from '../../components/PostCard';

function BookmarksPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { t } = useLang();

  useEffect(() => {
    setLoading(true);
    getBookmarks(page)
      .then((res) => { setPosts(res.data); setTotalPages(res.meta.totalPages); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-light text-text-primary mb-8">{t('bookmark.title')}</h1>

      {loading ? (
        <div className="text-center py-20 text-text-muted">{t('common.loading')}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-text-muted">{t('bookmark.empty')}</div>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (<PostCard key={post.id} post={post} />))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-10">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="text-sm text-text-secondary hover:text-text-primary transition disabled:opacity-30">{t('home.prev')}</button>
          <span className="text-sm text-text-muted">{page} / {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-sm text-text-secondary hover:text-text-primary transition disabled:opacity-30">{t('home.next')}</button>
        </div>
      )}
    </div>
  );
}

export default function BookmarksPageWrapper() {
  return <AuthGuard><BookmarksPage /></AuthGuard>;
}
