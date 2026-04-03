'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { X } from 'lucide-react';
import { createPost } from '../../lib/api';
import { stripHtml } from '../../lib/utils';
import AuthGuard from '../../components/AuthGuard';
import TiptapEditor from '../../components/editor/TiptapEditor';
import { useLang } from '../../context/LangContext';

const MAX_TAGS = 7;
const MIN_TAG_LENGTH = 3;
const MAX_TAG_LENGTH = 25;

function WritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tagError, setTagError] = useState('');
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const { t } = useLang();

  const addTag = () => {
    const tag = tagInput.trim();
    setTagError('');

    if (!tag) return;
    if (tag.length < MIN_TAG_LENGTH) {
      setTagError(`Tag must be at least ${MIN_TAG_LENGTH} characters`);
      return;
    }
    if (tag.length > MAX_TAG_LENGTH) {
      setTagError(`Tag must be less than ${MAX_TAG_LENGTH} characters`);
      return;
    }
    if (tags.length >= MAX_TAGS) {
      setTagError(`Maximum ${MAX_TAGS} tags allowed`);
      return;
    }
    if (tags.some((t) => t.toLowerCase() === tag.toLowerCase())) {
      setTagError('Tag already added');
      return;
    }

    setTags([...tags, tag]);
    setTagInput('');
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
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
        tagNames: tags.length > 0 ? tags : undefined,
      });
      router.push(`/blog/${post.slug}`);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="text-sm text-text-muted hover:text-text-secondary transition">
          {t('write.back')}
        </Link>
        <div className="flex gap-3">
          <button
            onClick={() => handleSave('draft')}
            disabled={saving || !title.trim()}
            className="px-4 py-2 rounded-xl bg-surface-secondary text-sm text-text-secondary hover:bg-surface-tertiary transition disabled:opacity-50"
          >
            {t('write.draft')}
          </button>
          <button
            onClick={() => handleSave('published')}
            disabled={saving || !title.trim()}
            className="px-4 py-2 rounded-xl bg-accent hover:bg-accent-dark text-sm text-text-primary transition disabled:opacity-50"
          >
            {saving ? t('write.publishing') : t('write.publish')}
          </button>
        </div>
      </div>

      {/* Title */}
      <input
        type="text"
        placeholder={t('write.titlePlaceholder')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        className="w-full text-4xl font-light text-text-primary placeholder:text-surface-tertiary bg-transparent border-none outline-none mb-4"
      />

      {/* Tags */}
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-pastel-mint text-text-primary"
            >
              {tag}
              <button onClick={() => removeTag(i)} className="hover:text-red-400 transition">
                <X size={12} />
              </button>
            </span>
          ))}
          {tags.length < MAX_TAGS && (
            <input
              type="text"
              placeholder={tags.length === 0 ? t('write.addTags') : t('write.addMore')}
              value={tagInput}
              onChange={(e) => { setTagInput(e.target.value); setTagError(''); }}
              onKeyDown={handleTagKeyDown}
              onBlur={addTag}
              maxLength={MAX_TAG_LENGTH}
              className="flex-1 min-w-[140px] px-2 py-1 text-sm text-text-primary placeholder:text-text-muted bg-transparent border-none outline-none"
            />
          )}
        </div>
        {tagError && (
          <p className="text-xs text-red-400">{tagError}</p>
        )}
        <p className="text-xs text-text-muted">
          {tags.length}/{MAX_TAGS} tags · {MIN_TAG_LENGTH}-{MAX_TAG_LENGTH} characters each
        </p>
      </div>

      {/* Editor */}
      <TiptapEditor
        content=""
        onChange={setContent}
        placeholder={t('write.editorPlaceholder')}
      />
    </div>
  );
}

export default function WritePageWrapper() {
  return (
    <AuthGuard>
      <WritePage />
    </AuthGuard>
  );
}
