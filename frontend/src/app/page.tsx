'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getPosts, getTags, type Post, type Tag } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';
import Logo from '../components/Logo';

export default function Home() {
  const { user, isLoading: authLoading } = useAuth();
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

  useEffect(() => {
    getTags().then(setTags).catch(() => {});
  }, []);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Show hero for non-logged-in users
  const showHero = !authLoading && !user;

  return (
    <div>
      {/* Hero section for visitors */}
      {showHero && (
        <div className="bg-gradient-to-b from-accent/30 to-surface">
          <div className="max-w-4xl mx-auto px-6 py-20 text-center">
            <Logo size="lg" className="justify-center mb-6" />
            <p className="text-xl text-text-secondary mb-2">
              Қазақша блог платформасы
            </p>
            <p className="text-text-muted mb-8">
              Ойларыңмен бөліс. Оқы. Біріг.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link
                href="/register"
                className="px-6 py-3 rounded-xl bg-accent hover:bg-accent-dark text-sm font-medium text-text-primary transition"
              >
                Тіркелу — Sign Up
              </Link>
              <Link
                href="/login"
                className="px-6 py-3 rounded-xl bg-surface-secondary hover:bg-surface-tertiary text-sm text-text-secondary transition"
              >
                Кіру — Sign In
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Write CTA for logged-in users */}
      <div className="max-w-4xl mx-auto px-6 pt-10">
        {user && (
          <Link
            href="/write"
            className="block mb-8 p-6 rounded-2xl bg-accent/30 hover:bg-accent/50 transition text-center group"
          >
            <span className="text-lg text-text-secondary group-hover:text-text-primary transition">
              Не ойлап жүрсің? Жаз...
            </span>
          </Link>
        )}

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Іздеу — Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 rounded-full bg-surface-secondary border-none outline-none text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-accent transition"
          />
        </div>

        {/* Tags */}
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => { setSelectedTag(''); setPage(1); }}
              className={`px-4 py-1.5 text-xs rounded-full transition ${
                !selectedTag ? 'bg-accent text-text-primary' : 'bg-surface-secondary text-text-muted hover:bg-surface-tertiary'
              }`}
            >
              Барлығы
            </button>
            {tags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => { setSelectedTag(tag.slug); setPage(1); }}
                className={`px-4 py-1.5 text-xs rounded-full transition ${
                  selectedTag === tag.slug ? 'bg-accent text-text-primary' : 'bg-surface-secondary text-text-muted hover:bg-surface-tertiary'
                }`}
              >
                {tag.name}
              </button>
            ))}
          </div>
        )}

        {/* Posts */}
        {loading ? (
          <div className="text-center py-20 text-text-muted">Жүктелуде...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20 text-text-muted">
            Жазбалар табылмады
          </div>
        ) : (
          <div className="space-y-2">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-6 mt-10 pb-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="text-sm text-text-secondary hover:text-text-primary transition disabled:opacity-30"
            >
              ← Алдыңғы
            </button>
            <span className="text-sm text-text-muted">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="text-sm text-text-secondary hover:text-text-primary transition disabled:opacity-30"
            >
              Келесі →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
