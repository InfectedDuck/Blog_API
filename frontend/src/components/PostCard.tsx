'use client';

import Link from 'next/link';
import type { Post } from '../lib/api';
import { formatDate, stripHtml } from '../lib/utils';

export default function PostCard({ post }: { post: Post }) {
  const excerpt = post.excerpt || stripHtml(post.content).slice(0, 160) + '...';
  const authorName = post.author.displayName || post.author.username;

  return (
    <article className="p-6 rounded-2xl hover:shadow-md transition-shadow duration-300">
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post.tags.map((tag) => (
            <span
              key={tag.id}
              className="px-3 py-1 text-xs rounded-full bg-pastel-lavender text-text-secondary"
            >
              {tag.name}
            </span>
          ))}
        </div>
      )}

      <Link href={`/blog/${post.slug}`}>
        <h2 className="text-xl font-semibold text-text-primary hover:text-text-secondary transition mb-2">
          {post.title}
        </h2>
      </Link>

      <p className="text-text-secondary text-sm leading-relaxed line-clamp-2 mb-4">
        {excerpt}
      </p>

      <div className="flex items-center gap-2 text-xs text-text-muted">
        <Link href={`/profile/${post.author.username}`} className="flex items-center gap-1.5 hover:text-text-secondary transition">
          {post.author.avatarUrl ? (
            <img src={post.author.avatarUrl} alt="" className="w-5 h-5 rounded-full object-cover" />
          ) : (
            <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center text-[10px] font-medium text-text-primary">
              {authorName[0].toUpperCase()}
            </div>
          )}
          {authorName}
        </Link>
        <span>·</span>
        <span>{formatDate(post.publishedAt || post.createdAt)}</span>
        <span>·</span>
        <span>{post.views} views</span>
      </div>
    </article>
  );
}
