'use client';

import { useState, useEffect, use } from 'react';
import { getPublicProfile, getPosts, getFollowStats, type PublicProfile, type Post, type PaginationMeta } from '../../../lib/api';
import { formatDate } from '../../../lib/utils';
import PostCard from '../../../components/PostCard';
import FollowButton from '../../../components/FollowButton';
import { useLang } from '../../../context/LangContext';
import { useAuth } from '../../../context/AuthContext';

export default function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = use(params);
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [followStats, setFollowStats] = useState({ followersCount: 0, followingCount: 0, isFollowing: false });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { t } = useLang();
  const { user } = useAuth();

  useEffect(() => {
    const load = async () => {
      try {
        const p = await getPublicProfile(username);
        setProfile(p);
        const [postsRes, stats] = await Promise.all([
          getPosts({ authorId: p.id, page, limit: 10 }),
          getFollowStats(p.id),
        ]);
        setPosts(postsRes.data);
        setMeta(postsRes.meta);
        setFollowStats(stats);
      } catch (err: any) {
        setError(err.message || 'User not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [username, page]);

  if (loading) {
    return <div className="max-w-4xl mx-auto px-6 py-20 text-center text-text-muted">{t('common.loading')}</div>;
  }

  if (error || !profile) {
    return <div className="max-w-4xl mx-auto px-6 py-20 text-center text-text-muted">{error || 'User not found'}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-10 pb-8 border-b border-surface-tertiary">
        <div className="flex items-start gap-4 mb-3">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt="" className="w-16 h-16 rounded-full object-cover" />
          ) : (
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-2xl font-semibold text-text-primary">
              {(profile.displayName || profile.username)[0].toUpperCase()}
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-semibold text-text-primary">
                {profile.displayName || profile.username}
              </h1>
              {user && user.id !== profile.id && (
                <FollowButton
                  userId={profile.id}
                  initialFollowing={followStats.isFollowing}
                  onToggle={(_, count) => setFollowStats((s) => ({ ...s, followersCount: count }))}
                />
              )}
            </div>
            <div className="flex items-center gap-3 text-sm text-text-muted mt-1">
              {profile.displayName && <span>@{profile.username}</span>}
              <span>{t('profile.joined')} {formatDate(profile.createdAt)}</span>
            </div>
            <div className="flex items-center gap-4 text-sm text-text-secondary mt-2">
              <span><strong>{followStats.followersCount}</strong> {t('follow.followers')}</span>
              <span><strong>{followStats.followingCount}</strong> {t('follow.following')}</span>
            </div>
          </div>
        </div>
        {profile.bio && (
          <p className="text-sm text-text-secondary mt-3 max-w-lg">{profile.bio}</p>
        )}
      </div>

      <h2 className="text-lg font-medium text-text-primary mb-4">
        {t('profile.stories')} {profile.displayName || profile.username}
      </h2>

      {posts.length === 0 ? (
        <p className="text-sm text-text-muted py-8 text-center">{t('profile.noStories')}</p>
      ) : (
        <div className="space-y-2">
          {posts.map((post) => (<PostCard key={post.id} post={post} />))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-6 mt-10">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="text-sm text-text-secondary hover:text-text-primary transition disabled:opacity-30">{t('home.prev')}</button>
          <span className="text-sm text-text-muted">{page} / {meta.totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages} className="text-sm text-text-secondary hover:text-text-primary transition disabled:opacity-30">{t('home.next')}</button>
        </div>
      )}
    </div>
  );
}
