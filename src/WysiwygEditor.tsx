"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextAlign from "@tiptap/extension-text-align"
import Link from "@tiptap/extension-link"
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Undo,
  Redo,
} from "lucide-react"
import "./wysiwyg-editor.css"

export interface WysiwygEditorProps {
  content?: string
  onChange?: (html: string) => void
  placeholder?: string
  className?: string
}

export function WysiwygEditor({
  content = "",
  onChange,
  placeholder = "Start typing...",
  className = "",
}: WysiwygEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        openOnClick: false,
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "wysiwyg-editor-content",
      },
    },
  })

  if (!editor) {
    return null
  }

  const addLink = () => {
    const url = window.prompt("Enter URL:")
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }
  // EditorContent's types in some @tiptap/react versions may not include
  // `immediatelyRender`. Create a props object and cast the extra prop to any
  // so TypeScript doesn't complain while preserving runtime behavior.
  const editorContentProps = { editor, ...( { immediatelyRender: false } as any ) }

  return (
    <div className={`wysiwyg-editor-wrapper ${className}`}>
      <div className="wysiwyg-toolbar">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
          title="Bold"
          type="button"
        >
          <Bold size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
          title="Italic"
          type="button"
        >
          <Italic size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "is-active" : ""}
          title="Underline"
          type="button"
        >
          <UnderlineIcon size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
          title="Strikethrough"
          type="button"
        >
          <Strikethrough size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
          title="Code"
          type="button"
        >
          <Code size={18} />
        </button>

        <div className="wysiwyg-separator" />

        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
          title="Heading 1"
          type="button"
        >
          <Heading1 size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
          title="Heading 2"
          type="button"
        >
          <Heading2 size={18} />
        </button>

        <div className="wysiwyg-separator" />

        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
          title="Bullet List"
          type="button"
        >
          <List size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
          title="Numbered List"
          type="button"
        >
          <ListOrdered size={18} />
        </button>

        <div className="wysiwyg-separator" />

        <button
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""}
          title="Align Left"
          type="button"
        >
          <AlignLeft size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""}
          title="Align Center"
          type="button"
        >
          <AlignCenter size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""}
          title="Align Right"
          type="button"
        >
          <AlignRight size={18} />
        </button>

        <div className="wysiwyg-separator" />

        <button onClick={addLink} title="Add Link" type="button">
          <Link2 size={18} />
        </button>

        <div className="wysiwyg-separator" />

        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          title="Undo"
          type="button"
        >
          <Undo size={18} />
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          title="Redo"
          type="button"
        >
          <Redo size={18} />
        </button>
      </div>

      <EditorContent {...editorContentProps} />
    </div>
  )
}
