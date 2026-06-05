import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'

interface RichEditorProps {
  content: string
  onChange: (html: string) => void
  placeholder?: string
}

export default function RichEditor({ content, onChange, placeholder }: RichEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: placeholder ?? 'Let the words flow…',
      }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'rich-editor-content',
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': 'Entry content',
      },
    },
  })

  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (current !== content) editor.commands.setContent(content)
  }, [content]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="rich-editor">
      <div className="rich-editor-toolbar" role="toolbar" aria-label="Text formatting">
        <button
          type="button"
          className={`toolbar-btn${editor?.isActive('bold') ? ' is-active' : ''}`}
          onClick={() => editor?.chain().focus().toggleBold().run()}
          title="Bold (Ctrl+B)"
          aria-label="Bold"
          aria-pressed={editor?.isActive('bold')}
        >
          <strong>B</strong>
        </button>
        <button
          type="button"
          className={`toolbar-btn${editor?.isActive('italic') ? ' is-active' : ''}`}
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          title="Italic (Ctrl+I)"
          aria-label="Italic"
          aria-pressed={editor?.isActive('italic')}
        >
          <em>I</em>
        </button>
        <button
          type="button"
          className={`toolbar-btn${editor?.isActive('strike') ? ' is-active' : ''}`}
          onClick={() => editor?.chain().focus().toggleStrike().run()}
          title="Strikethrough"
          aria-label="Strikethrough"
          aria-pressed={editor?.isActive('strike')}
        >
          <s>S</s>
        </button>
        <div className="toolbar-divider" aria-hidden="true" />
        <button
          type="button"
          className={`toolbar-btn${editor?.isActive('bulletList') ? ' is-active' : ''}`}
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          title="Bullet list"
          aria-label="Bullet list"
          aria-pressed={editor?.isActive('bulletList')}
        >
          ☰
        </button>
        <button
          type="button"
          className={`toolbar-btn${editor?.isActive('orderedList') ? ' is-active' : ''}`}
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          title="Numbered list"
          aria-label="Numbered list"
          aria-pressed={editor?.isActive('orderedList')}
        >
          ≡
        </button>
        <button
          type="button"
          className={`toolbar-btn${editor?.isActive('blockquote') ? ' is-active' : ''}`}
          onClick={() => editor?.chain().focus().toggleBlockquote().run()}
          title="Block quote"
          aria-label="Quote"
          aria-pressed={editor?.isActive('blockquote')}
        >
          ❝
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
