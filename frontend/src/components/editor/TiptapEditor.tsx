'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle, FontFamily, FontSize } from '@tiptap/extension-text-style';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import EditorToolbar from './EditorToolbar';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function TiptapEditor({ content, onChange, placeholder }: TiptapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      FontFamily,
      FontSize,
      Placeholder.configure({ placeholder: placeholder || 'Start writing your story...' }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'min-h-[500px] px-4 py-4 outline-none text-text-primary leading-relaxed',
        style: 'font-size: 16px;',
      },
    },
  });

  return (
    <div className="border border-surface-tertiary rounded-xl bg-white">
      <EditorToolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
