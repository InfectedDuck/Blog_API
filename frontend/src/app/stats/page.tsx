'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAuthorStats, type AuthorStats } from '../../lib/api';
import { formatDate } from '../../lib/utils';
import AuthGuard from '../../components/AuthGuard';
import StatsCard from '../../components/StatsCard';

function StatsPage() {
  const [stats, setStats] = useState<AuthorStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuthorStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center py-20 text-text-muted">Loading...</div>;
  }

  if (!stats) {
    return <div className="text-center py-20 text-text-muted">Unable to load stats</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-light text-text-primary mb-8">Your Stats</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatsCard
          label="Total Posts"
          value={stats.totals.totalPosts}
          sublabel={`${stats.totals.totalPublished} published, ${stats.totals.totalDrafts} drafts`}
          bgColor="bg-pastel-pink"
        />
        <StatsCard
          label="Total Views"
          value={stats.totals.totalViews}
          bgColor="bg-pastel-blue"
        />
        <StatsCard
          label="Total Likes"
          value={stats.totals.totalLikes}
          bgColor="bg-pastel-lavender"
        />
        <StatsCard
          label="Total Comments"
          value={stats.totals.totalComments}
          bgColor="bg-pastel-mint"
        />
      </div>

      {/* Posts Table */}
      {stats.posts.length === 0 ? (
        <div className="text-center py-10 text-text-muted">
          No posts yet.{' '}
          <Link href="/write" className="text-text-secondary hover:text-text-primary transition">
            Write your first story
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-muted border-b border-surface-tertiary">
                  <th className="pb-3 font-medium">Title</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium text-right">Views</th>
                  <th className="pb-3 font-medium text-right">Likes</th>
                  <th className="pb-3 font-medium text-right">Comments</th>
                  <th className="pb-3 font-medium text-right">Date</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody>
                {stats.posts.map((post) => (
                  <tr key={post.id} className="border-b border-surface-tertiary">
                    <td className="py-4">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-text-primary hover:text-text-secondary transition"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 text-xs rounded-full ${
                          post.status === 'published'
                            ? 'bg-pastel-mint text-text-secondary'
                            : 'bg-surface-secondary text-text-muted'
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="py-4 text-right text-text-secondary">{post.views}</td>
                    <td className="py-4 text-right text-text-secondary">{post.likesCount}</td>
                    <td className="py-4 text-right text-text-secondary">{post.commentsCount}</td>
                    <td className="py-4 text-right text-text-muted">{formatDate(post.createdAt)}</td>
                    <td className="py-4 text-right">
                      <Link
                        href={`/edit/${post.slug}`}
                        className="text-xs text-text-muted hover:text-text-primary transition"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {stats.posts.map((post) => (
              <div key={post.id} className="bg-surface-secondary rounded-2xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-text-primary hover:text-text-secondary transition"
                  >
                    {post.title}
                  </Link>
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full ${
                      post.status === 'published'
                        ? 'bg-pastel-mint text-text-secondary'
                        : 'bg-white text-text-muted'
                    }`}
                  >
                    {post.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-text-muted">
                  <span>{post.views} views</span>
                  <span>{post.likesCount} likes</span>
                  <span>{post.commentsCount} comments</span>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-text-muted">{formatDate(post.createdAt)}</span>
                  <Link
                    href={`/edit/${post.slug}`}
                    className="text-xs text-text-muted hover:text-text-primary transition"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function StatsPageWrapper() {
  return (
    <AuthGuard requiredRoles={['author', 'admin']}>
      <StatsPage />
    </AuthGuard>
  );
}
