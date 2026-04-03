'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAuthorStats, type AuthorStats } from '../../lib/api';
import { formatDate } from '../../lib/utils';
import AuthGuard from '../../components/AuthGuard';
import StatsCard from '../../components/StatsCard';
import { SkeletonLine } from '../../components/Skeleton';
import { useLang } from '../../context/LangContext';

function StatsPage() {
  const [stats, setStats] = useState<AuthorStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { t } = useLang();

  useEffect(() => {
    getAuthorStats()
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-10">
        <SkeletonLine width="150px" height="28px" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          {[1,2,3,4].map(i => <div key={i} className="h-24 rounded-2xl bg-surface-tertiary animate-pulse" />)}
        </div>
        <div className="mt-10 space-y-4">
          {[1,2,3].map(i => <SkeletonLine key={i} width="100%" height="48px" />)}
        </div>
      </div>
    );
  }

  if (!stats) {
    return <div className="text-center py-20 text-text-muted">{t('common.loading')}</div>;
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-light text-text-primary mb-8">{t('stats.title')}</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatsCard
          label={t('stats.totalPosts')}
          value={stats.totals.totalPosts}
          sublabel={`${stats.totals.totalPublished} ${t('stats.published')}, ${stats.totals.totalDrafts} ${t('stats.drafts')}`}
          bgColor="bg-pastel-pink"
        />
        <StatsCard
          label={t('stats.totalViews')}
          value={stats.totals.totalViews}
          bgColor="bg-pastel-blue"
        />
        <StatsCard
          label={t('stats.totalLikes')}
          value={stats.totals.totalLikes}
          bgColor="bg-pastel-lavender"
        />
        <StatsCard
          label={t('stats.totalComments')}
          value={stats.totals.totalComments}
          bgColor="bg-pastel-mint"
        />
      </div>

      {/* Posts Table */}
      {stats.posts.length === 0 ? (
        <div className="text-center py-10 text-text-muted">
          {t('stats.noPosts')}{' '}
          <Link href="/write" className="text-text-secondary hover:text-text-primary transition">
            {t('stats.writeFirst')}
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-text-muted border-b border-surface-tertiary">
                  <th className="pb-3 font-medium">{t('stats.colTitle')}</th>
                  <th className="pb-3 font-medium">{t('stats.colStatus')}</th>
                  <th className="pb-3 font-medium text-right">{t('stats.colViews')}</th>
                  <th className="pb-3 font-medium text-right">{t('stats.colLikes')}</th>
                  <th className="pb-3 font-medium text-right">{t('stats.colComments')}</th>
                  <th className="pb-3 font-medium text-right">{t('stats.colDate')}</th>
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
                        {t('stats.edit')}
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
                    {t('stats.edit')}
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
    <AuthGuard>
      <StatsPage />
    </AuthGuard>
  );
}
