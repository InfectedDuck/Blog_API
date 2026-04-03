'use client';

import { useState } from 'react';
import { toggleFollow } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LangContext';
import { useRouter } from 'next/navigation';

interface FollowButtonProps {
  userId: number;
  initialFollowing: boolean;
  onToggle?: (following: boolean, count: number) => void;
}

export default function FollowButton({ userId, initialFollowing, onToggle }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { t } = useLang();
  const router = useRouter();

  if (user?.id === userId) return null;

  const handleToggle = async () => {
    if (!user) { router.push('/login'); return; }
    if (loading) return;
    setLoading(true);
    try {
      const res = await toggleFollow(userId);
      setFollowing(res.following);
      onToggle?.(res.following, res.followersCount);
    } catch {} finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={`px-4 py-1.5 text-sm rounded-full transition ${
        following
          ? 'bg-surface-tertiary text-text-secondary hover:bg-pastel-pink hover:text-text-primary'
          : 'bg-accent hover:bg-accent-dark text-text-primary'
      }`}
    >
      {following ? t('follow.unfollow') : t('follow.follow')}
    </button>
  );
}
