'use client';

import { useState, useEffect, useCallback } from 'react';
import { getPosts, getTags, type Post, type Tag } from '../lib/api';
import PostCard from '../components/PostCard';

export default function Home() {
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

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search stories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-5 py-3 rounded-full bg-surface-secondary border-none outline-none text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-pastel-lavender transition"
        />
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => { setSelectedTag(''); setPage(1); }}
            className={`px-4 py-1.5 text-xs rounded-full transition ${
              !selectedTag ? 'bg-pastel-mint text-text-primary' : 'bg-surface-secondary text-text-muted hover:bg-surface-tertiary'
            }`}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => { setSelectedTag(tag.slug); setPage(1); }}
              className={`px-4 py-1.5 text-xs rounded-full transition ${
                selectedTag === tag.slug ? 'bg-pastel-mint text-text-primary' : 'bg-surface-secondary text-text-muted hover:bg-surface-tertiary'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      {/* Posts */}
      {loading ? (
        <div className="text-center py-20 text-text-muted">Loading...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-text-muted">
          No stories found
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
        <div className="flex items-center justify-center gap-6 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-sm text-text-secondary hover:text-text-primary transition disabled:opacity-30"
          >
            Previous
          </button>
          <span className="text-sm text-text-muted">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-sm text-text-secondary hover:text-text-primary transition disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
