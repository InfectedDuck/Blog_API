'use client';

import { useState, useEffect } from 'react';
import { getComments, createComment, type Comment } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../lib/utils';

export default function CommentSection({ postId }: { postId: number }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadComments();
  }, [postId, page]);

  const loadComments = async () => {
    try {
      const res = await getComments(postId, page);
      setComments(res.data);
      setTotal(res.meta.total);
    } catch {
      // ignore
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || submitting) return;
    setSubmitting(true);
    try {
      await createComment(postId, body.trim());
      setBody('');
      setPage(1);
      await loadComments();
    } catch {
      // ignore
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-12">
      <h3 className="text-lg font-medium text-text-primary mb-6">
        Comments ({total})
      </h3>

      {user && (
        <form onSubmit={handleSubmit} className="mb-8">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-surface-secondary border-none outline-none text-sm text-text-primary placeholder:text-text-muted focus:ring-2 focus:ring-pastel-lavender transition resize-none"
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || !body.trim()}
              className="px-5 py-2 rounded-xl bg-pastel-lavender hover:bg-pastel-lavender-dark text-sm text-text-primary transition disabled:opacity-50"
            >
              {submitting ? 'Posting...' : 'Comment'}
            </button>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="border-b border-surface-tertiary pb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-text-primary">
                {comment.author.username}
              </span>
              <span className="text-xs text-text-muted">
                {timeAgo(comment.createdAt)}
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {comment.body}
            </p>
          </div>
        ))}
      </div>

      {comments.length === 0 && (
        <p className="text-sm text-text-muted text-center py-4">
          No comments yet. Be the first to share your thoughts.
        </p>
      )}
    </div>
  );
}
