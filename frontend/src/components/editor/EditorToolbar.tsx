'use client';

import type { Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
} from 'lucide-react';

interface ToolbarProps {
  editor: Editor | null;
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`p-2 rounded-lg transition ${
        active ? 'bg-pastel-lavender text-text-primary' : 'text-text-muted hover:bg-surface-secondary'
      }`}
    >
      {children}
    </button>
  );
}

function Separator() {
  return <div className="w-px h-6 bg-surface-tertiary mx-1" />;
}

export default function EditorToolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-surface-tertiary bg-white sticky top-[65px] z-40 rounded-t-xl">
      {/* Format */}
      <ToolbarButton
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
        title="Bold"
      >
        <Bold size={16} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
        title="Italic"
      >
        <Italic size={16} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        title="Underline"
      >
        <Underline size={16} />
      </ToolbarButton>

      <Separator />

      {/* Headings */}
      <ToolbarButton
        active={editor.isActive('heading', { level: 1 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        title="Heading 1"
      >
        <Heading1 size={16} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('heading', { level: 2 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        title="Heading 2"
      >
        <Heading2 size={16} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('heading', { level: 3 })}
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        title="Heading 3"
      >
        <Heading3 size={16} />
      </ToolbarButton>

      <Separator />

      {/* Font family */}
      <select
        onChange={(e) => {
          if (e.target.value === 'default') {
            editor.chain().focus().unsetFontFamily().run();
          } else {
            editor.chain().focus().setFontFamily(e.target.value).run();
          }
        }}
        className="px-2 py-1.5 rounded-lg text-xs bg-surface-secondary text-text-secondary border-none outline-none cursor-pointer"
        title="Font family"
      >
        <option value="default">Sans Serif</option>
        <option value="Georgia, serif">Serif</option>
        <option value="monospace">Mono</option>
      </select>

      {/* Font size */}
      <select
        onChange={(e) => {
          if (e.target.value === 'default') {
            editor.chain().focus().unsetFontSize().run();
          } else {
            editor.chain().focus().setFontSize(e.target.value).run();
          }
        }}
        className="px-2 py-1.5 rounded-lg text-xs bg-surface-secondary text-text-secondary border-none outline-none cursor-pointer"
        title="Font size"
      >
        <option value="default">Normal (16px)</option>
        <option value="13px">Small</option>
        <option value="18px">Large</option>
        <option value="22px">XL</option>
        <option value="28px">2XL</option>
      </select>

      <Separator />

      {/* Alignment */}
      <ToolbarButton
        active={editor.isActive({ textAlign: 'left' })}
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        title="Align left"
      >
        <AlignLeft size={16} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive({ textAlign: 'center' })}
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        title="Align center"
      >
        <AlignCenter size={16} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive({ textAlign: 'right' })}
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        title="Align right"
      >
        <AlignRight size={16} />
      </ToolbarButton>

      <Separator />

      {/* Lists */}
      <ToolbarButton
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        title="Bullet list"
      >
        <List size={16} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        title="Ordered list"
      >
        <ListOrdered size={16} />
      </ToolbarButton>
      <ToolbarButton
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        title="Blockquote"
      >
        <Quote size={16} />
      </ToolbarButton>
    </div>
  );
}
