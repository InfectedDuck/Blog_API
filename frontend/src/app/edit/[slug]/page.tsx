'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { getPostBySlug, updatePost, deletePost, getTags, type Post, type Tag } from '../../../lib/api';
import { stripHtml } from '../../../lib/utils';
import AuthGuard from '../../../components/AuthGuard';
import TiptapEditor from '../../../components/editor/TiptapEditor';
import { useLang } from '../../../context/LangContext';

function EditPage({ slug }: { slug: string }) {
  const [post, setPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { t } = useLang();

  useEffect(() => {
    const load = async () => {
      try {
        const [p, fetchedTags] = await Promise.all([getPostBySlug(slug), getTags()]);
        setPost(p);
        setTitle(p.title);
        setContent(p.content);
        setTags(fetchedTags);
        setSelectedTags(p.tags.map((tag) => tag.id));
      } catch {
        router.push('/');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, router]);

  const toggleTag = (id: number) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const handleSave = async (status?: string) => {
    if (!post || !title.trim()) return;
    setSaving(true);
    try {
      const excerpt = stripHtml(content).slice(0, 150);
      await updatePost(post.id, {
        title: title.trim(),
        content,
        excerpt,
        ...(status && { status }),
        tagIds: selectedTags,
      });
      router.push(`/blog/${post.slug}`);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!post || !window.confirm(t('edit.confirmDelete'))) return;
    try {
      await deletePost(post.id);
      router.push('/stats');
    } catch {
      // ignore
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-text-muted">{t('common.loading')}</div>;
  }

  if (!post) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-3xl font-light text-text-primary placeholder:text-text-muted bg-transparent border-none outline-none mb-6"
      />

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={`px-3 py-1 text-xs rounded-full transition ${
                selectedTags.includes(tag.id)
                  ? 'bg-pastel-mint text-text-primary'
                  : 'bg-surface-secondary text-text-muted hover:bg-surface-tertiary'
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      )}

      <TiptapEditor content={content} onChange={setContent} />

      <div className="flex items-center justify-between mt-6">
        <button
          onClick={handleDelete}
          className="text-sm text-red-400 hover:text-red-500 transition"
        >
          {t('edit.delete')}
        </button>
        <div className="flex gap-3">
          {post.status === 'draft' && (
            <button
              onClick={() => handleSave('published')}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-pastel-mint hover:bg-pastel-mint-dark text-sm text-text-primary transition disabled:opacity-50"
            >
              {t('edit.publish')}
            </button>
          )}
          {post.status === 'published' && (
            <button
              onClick={() => handleSave('draft')}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl bg-surface-secondary text-sm text-text-secondary transition disabled:opacity-50"
            >
              {t('edit.unpublish')}
            </button>
          )}
          <button
            onClick={() => handleSave()}
            disabled={saving || !title.trim()}
            className="px-5 py-2.5 rounded-xl bg-pastel-lavender hover:bg-pastel-lavender-dark text-sm text-text-primary transition disabled:opacity-50"
          >
            {saving ? t('edit.saving') : t('edit.save')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditPageWrapper({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return (
    <AuthGuard>
      <EditPage slug={slug} />
    </AuthGuard>
  );
}
