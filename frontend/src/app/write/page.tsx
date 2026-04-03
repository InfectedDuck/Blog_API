'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createPost, getTags, type Tag } from '../../lib/api';
import { stripHtml } from '../../lib/utils';
import AuthGuard from '../../components/AuthGuard';
import TiptapEditor from '../../components/editor/TiptapEditor';

function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    getTags().then(setTags).catch(() => {});
  }, []);

  const toggleTag = (id: number) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id],
    );
  };

  const handleSave = async (status: string) => {
    if (!title.trim() || !content.trim()) return;
    setSaving(true);
    try {
      const excerpt = stripHtml(content).slice(0, 150);
      const post = await createPost({
        title: title.trim(),
        content,
        excerpt,
        status,
        tagIds: selectedTags.length > 0 ? selectedTags : undefined,
      });
      router.push(`/blog/${post.slug}`);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

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

      <TiptapEditor content="" onChange={setContent} />

      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={() => handleSave('draft')}
          disabled={saving || !title.trim()}
          className="px-5 py-2.5 rounded-xl bg-surface-secondary text-sm text-text-secondary hover:bg-surface-tertiary transition disabled:opacity-50"
        >
          Save Draft
        </button>
        <button
          onClick={() => handleSave('published')}
          disabled={saving || !title.trim()}
          className="px-5 py-2.5 rounded-xl bg-pastel-lavender hover:bg-pastel-lavender-dark text-sm text-text-primary transition disabled:opacity-50"
        >
          {saving ? 'Publishing...' : 'Publish'}
        </button>
      </div>
    </div>
  );
}

export default function WritePageWrapper() {
  return (
    <AuthGuard requiredRoles={['author', 'admin']}>
      <WritePage />
    </AuthGuard>
  );
}
