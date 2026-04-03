'use client';

import { useState, useEffect, useRef, use } from 'react';
import { getPostBySlug, getPostLikes, trackPostView, type Post } from '../../../lib/api';
import Link from 'next/link';
import { formatDate } from '../../../lib/utils';
import LikeButton from '../../../components/LikeButton';
import CommentSection from '../../../components/CommentSection';
import AiAnalysis from '../../../components/AiAnalysis';
import BookmarkButton from '../../../components/BookmarkButton';
import ShareButtons from '../../../components/ShareButtons';
import ReadingProgress from '../../../components/ReadingProgress';
import { PostPageSkeleton } from '../../../components/Skeleton';
import { useAuth } from '../../../context/AuthContext';
import { useLang } from '../../../context/LangContext';

export default function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { user } = useAuth();
  const { t } = useLang();
  const [post, setPost] = useState<Post | null>(null);
  const [likes, setLikes] = useState({ totalLikes: 0, isLiked: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const viewTracked = useRef(false);

  useEffect(() => {
    const load = async () => {
      try {
        const p = await getPostBySlug(slug);
        setPost(p);
        const l = await getPostLikes(p.id);
        setLikes(l);
        if (!viewTracked.current) {
          viewTracked.current = true;
          trackPostView(slug).catch(() => {});
        }
      } catch (err: any) {
        setError(err.message || 'Post not found');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug]);

  if (loading) return <PostPageSkeleton />;

  if (error || !post) {
    return <div className="max-w-3xl mx-auto px-6 py-20 text-center text-text-muted">{error || 'Post not found'}</div>;
  }

  return (
    <>
      <ReadingProgress />
      <article className="max-w-3xl mx-auto px-6 py-10">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span key={tag.id} className="px-3 py-1 text-xs rounded-full bg-pastel-lavender text-text-secondary">
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Meta */}
        <div className="flex items-center flex-wrap gap-3 text-sm text-text-muted mb-8">
          <Link href={`/profile/${post.author.username}`} className="flex items-center gap-2 hover:text-text-secondary transition">
            {post.author.avatarUrl ? (
              <img src={post.author.avatarUrl} alt="" className="w-6 h-6 rounded-full object-cover" />
            ) : (
              <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center text-xs font-medium text-text-primary">
                {(post.author.displayName || post.author.username)[0].toUpperCase()}
              </div>
            )}
            {post.author.displayName || post.author.username}
          </Link>
          <span>·</span>
          <span>{formatDate(post.publishedAt || post.createdAt)}</span>
          <span>·</span>
          <span>{post.views} {t('post.views')}</span>
        </div>

        <hr className="border-surface-tertiary mb-8" />

        {/* Content */}
        <div
          className="prose prose-lg max-w-none text-text-primary prose-headings:text-text-primary prose-p:text-text-secondary prose-a:text-pastel-lavender-dark"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Actions bar */}
        <div className="flex items-center justify-between mt-10 py-4 border-t border-surface-tertiary">
          <div className="flex items-center gap-3">
            <LikeButton postId={post.id} initialLiked={likes.isLiked} initialCount={likes.totalLikes} />
            <BookmarkButton postId={post.id} />
          </div>
          <ShareButtons title={post.title} slug={post.slug} />
        </div>

        {/* AI Analysis */}
        {user && <AiAnalysis postId={post.id} isOwnPost={user.id === post.author.id} />}

        {/* Comments */}
        <CommentSection postId={post.id} />
      </article>
    </>
  );
}
