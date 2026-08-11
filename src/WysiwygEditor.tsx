"use client"

import { useEffect, type CSSProperties, type ReactNode } from "react"
import { useEditor, EditorContent, type Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import { Placeholder } from "@tiptap/extensions"
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Braces,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Link2Off,
  Undo,
  Redo,
} from "lucide-react"
import "./wysiwyg-editor.css"

export type ToolbarGroup =
  | "formatting"
  | "headings"
  | "lists"
  | "blocks"
  | "align"
  | "link"
  | "history"

const ALL_GROUPS: ToolbarGroup[] = [
  "formatting",
  "headings",
  "lists",
  "blocks",
  "align",
  "link",
  "history",
]

export interface WysiwygEditorProps {
  /** Initial HTML content. Updating it from outside replaces the document. */
  content?: string
  /** Called with the editor's HTML on every change. */
  onChange?: (html: string) => void
  /** Hint shown while the editor is empty. */
  placeholder?: string
  /** Extra class names for the outer wrapper. */
  className?: string
  /** Toolbar groups to render, in order. Pass `[]` to hide the toolbar. */
  toolbar?: ToolbarGroup[]
  /** Set to false for a read-only view. @default true */
  editable?: boolean
  /** Focus the editor on mount. @default false */
  autofocus?: boolean
  /** Minimum height of the writing area. @default "200px" */
  minHeight?: number | string
  /** Maximum height of the writing area; overflow scrolls. */
  maxHeight?: number | string
  /** Receives the Tiptap editor instance for advanced control. */
  onReady?: (editor: Editor) => void
}

interface ToolbarButtonProps {
  onClick: () => void
  label: string
  active?: boolean
  disabled?: boolean
  children: ReactNode
}

function ToolbarButton({ onClick, label, active = false, disabled = false, children }: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={active ? "is-active" : ""}
      disabled={disabled}
      title={label}
      aria-label={label}
      aria-pressed={active}
    >
      {children}
    </button>
  )
}

const toCssSize = (value: number | string | undefined) =>
  typeof value === "number" ? `${value}px` : value

export function WysiwygEditor({
  content = "",
  onChange,
  placeholder = "Start typing...",
  className = "",
  toolbar = ALL_GROUPS,
  editable = true,
  autofocus = false,
  minHeight,
  maxHeight,
  onReady,
}: WysiwygEditorProps) {
  const editor = useEditor({
    extensions: [
      // Tiptap v3's StarterKit already includes Underline and Link, so they
      // are configured here instead of being registered a second time.
      StarterKit.configure({
        link: {
          openOnClick: false,
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content,
    editable,
    autofocus,
    // Required for SSR frameworks (e.g. Next.js): render on the client only.
    immediatelyRender: false,
    // v3 defaults to not rerendering on transactions; the toolbar's active
    // states need it.
    shouldRerenderOnTransaction: true,
    onCreate: ({ editor }) => {
      onReady?.(editor)
    },
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: "wysiwyg-editor-content",
      },
    },
  })

  // Keep the editor in sync when the `content` prop changes from outside.
  useEffect(() => {
    if (!editor || content === editor.getHTML()) return
    editor.commands.setContent(content, { emitUpdate: false })
  }, [content, editor])

  useEffect(() => {
    editor?.setEditable(editable)
  }, [editor, editable])

  if (!editor) {
    return null
  }

  const editLink = () => {
    const previous = editor.getAttributes("link").href as string | undefined
    const input = window.prompt("Enter URL:", previous ?? "")
    if (input === null) return
    const url = input.trim()
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run()
      return
    }
    // Default to https:// when no scheme was given.
    const href = /^(https?:\/\/|mailto:|tel:|\/|#)/i.test(url) ? url : `https://${url}`
    editor.chain().focus().extendMarkRange("link").setLink({ href }).run()
  }

  const groups: Record<ToolbarGroup, ReactNode> = {
    formatting: (
      <>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} label="Bold">
          <Bold size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} label="Italic">
          <Italic size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} label="Underline">
          <UnderlineIcon size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} label="Strikethrough">
          <Strikethrough size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive("code")} label="Inline code">
          <Code size={18} />
        </ToolbarButton>
      </>
    ),
    headings: (
      <>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          label="Heading 1"
        >
          <Heading1 size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          label="Heading 2"
        >
          <Heading2 size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          label="Heading 3"
        >
          <Heading3 size={18} />
        </ToolbarButton>
      </>
    ),
    lists: (
      <>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          label="Bullet list"
        >
          <List size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          label="Numbered list"
        >
          <ListOrdered size={18} />
        </ToolbarButton>
      </>
    ),
    blocks: (
      <>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          label="Blockquote"
        >
          <Quote size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          label="Code block"
        >
          <Braces size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} label="Horizontal rule">
          <Minus size={18} />
        </ToolbarButton>
      </>
    ),
    align: (
      <>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          label="Align left"
        >
          <AlignLeft size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          label="Align center"
        >
          <AlignCenter size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          label="Align right"
        >
          <AlignRight size={18} />
        </ToolbarButton>
      </>
    ),
    link: (
      <>
        <ToolbarButton onClick={editLink} active={editor.isActive("link")} label="Add or edit link">
          <Link2 size={18} />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
          disabled={!editor.isActive("link")}
          label="Remove link"
        >
          <Link2Off size={18} />
        </ToolbarButton>
      </>
    ),
    history: (
      <>
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} label="Undo">
          <Undo size={18} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} label="Redo">
          <Redo size={18} />
        </ToolbarButton>
      </>
    ),
  }

  const visibleGroups = toolbar.filter((group) => group in groups)

  const sizeStyle = {
    "--wysiwyg-min-height": toCssSize(minHeight),
    "--wysiwyg-max-height": toCssSize(maxHeight),
  } as CSSProperties

  return (
    <div className={`wysiwyg-editor-wrapper ${className}`.trim()} style={sizeStyle}>
      {editable && visibleGroups.length > 0 && (
        <div className="wysiwyg-toolbar" role="toolbar" aria-label="Text formatting">
          {visibleGroups.map((group, index) => (
            <div className="wysiwyg-toolbar-group" key={group}>
              {index > 0 && <div className="wysiwyg-separator" aria-hidden="true" />}
              {groups[group]}
            </div>
          ))}
        </div>
      )}

      <EditorContent editor={editor} />
    </div>
  )
}
