'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getPosts, getTags, type Post, type Tag } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import PostCard from '../components/PostCard';
import { FeedSkeleton } from '../components/Skeleton';
import Logo from '../components/Logo';

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
  const { t } = useLang();
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [search, setSearch] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPosts({
        page,
        limit: 10,
        ...(search && { search }),
        ...(selectedTag && { tag: selectedTag }),
      });
      setPosts(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedTag]);

  useEffect(() => { getTags().then(setTags).catch(() => {}); }, []);
  useEffect(() => { loadPosts(); }, [loadPosts]);
  useEffect(() => {
    const timer = setTimeout(() => setPage(1), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const showHero = !authLoading && !user;

  return (
    <div>
      {showHero && (
        <div className="bg-gradient-to-b from-accent/30 to-surface">
          <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <Logo size="lg" className="justify-center mb-6" />
            <p className="text-xl text-text-secondary mb-2">{t('hero.tagline')}</p>
            <p className="text-text-muted mb-8">{t('hero.subtitle')}</p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/register" className="px-6 py-3 rounded-xl bg-accent hover:bg-accent-dark text-sm font-medium text-text-primary transition">
                {t('hero.signUp')}
              </Link>
              <Link href="/login" className="px-6 py-3 rounded-xl bg-surface-secondary hover:bg-surface-tertiary text-sm text-text-secondary transition">
                {t('hero.signIn')}
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto px-6 pt-10">
        {user && (
          <Link href="/write" className="block mb-8 p-6 rounded-2xl bg-accent/30 hover:bg-accent/50 transition text-center group">
            <span className="text-lg text-text-secondary group-hover:text-text-primary transition">{t('home.writeCta')}</span>
          </Link>
        )}

        <div className="mb-6">
          <input
            type="text"
            placeholder={t('home.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-full bg-surface-secondary border-none outline-none text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-accent transition"
          />
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button onClick={() => { setSelectedTag(''); setPage(1); }} className={`px-4 py-1.5 text-xs rounded-full transition ${!selectedTag ? 'bg-accent text-text-primary' : 'bg-surface-secondary text-text-muted hover:bg-surface-tertiary'}`}>
              {t('home.all')}
            </button>
            {tags.map((tag) => (
              <button key={tag.id} onClick={() => { setSelectedTag(tag.slug); setPage(1); }} className={`px-4 py-1.5 text-xs rounded-full transition ${selectedTag === tag.slug ? 'bg-accent text-text-primary' : 'bg-surface-secondary text-text-muted hover:bg-surface-tertiary'}`}>
                {tag.name}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <FeedSkeleton />
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-text-muted">{t('home.noPosts')}</div>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (<PostCard key={post.id} post={post} />))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mt-10 pb-10">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="text-sm text-text-secondary hover:text-text-primary transition disabled:opacity-30">{t('home.prev')}</button>
            <span className="text-sm text-text-muted">{page} / {totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="text-sm text-text-secondary hover:text-text-primary transition disabled:opacity-30">{t('home.next')}</button>
          </div>
        )}
      </div>
    </div>
  );
}
