'use client';

import { useState } from 'react';
import { toggleLike } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
  postId: number;
  initialLiked: boolean;
  initialCount: number;
}

export default function LikeButton({ postId, initialLiked, initialCount }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const router = useRouter();

  const handleToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (loading) return;
    setLoading(true);
    try {
      const res = await toggleLike(postId);
      setLiked(res.liked);
      setCount(res.totalLikes);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className="flex items-center gap-2 px-4 py-2 rounded-full transition hover:bg-pastel-pink"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className={`w-5 h-5 transition ${liked ? 'fill-red-400 stroke-red-400' : 'fill-none stroke-text-muted'}`}
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
      <span className="text-sm text-text-secondary">{count}</span>
    </button>
  );
}
