# @sidi-eyel/wysiwyg-editor

[![npm version](https://img.shields.io/npm/v/%40sidi-eyel%2Fwysiwyg-editor)](https://www.npmjs.com/package/@sidi-eyel/wysiwyg-editor)
[![CI](https://github.com/SidiEyel/wysiwyg/actions/workflows/ci.yml/badge.svg)](https://github.com/SidiEyel/wysiwyg/actions/workflows/ci.yml)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

A modern, lightweight WYSIWYG editor component for React, built on [Tiptap](https://tiptap.dev) v3. Batteries included — toolbar, styling, and placeholder support out of the box — but every part is configurable.

## Features

- **Rich text formatting** — bold, italic, underline, strikethrough, inline code
- **Headings** — H1, H2, H3
- **Lists** — bullet and numbered
- **Blocks** — blockquote, code block, horizontal rule
- **Text alignment** — left, center, right
- **Links** — add, edit, and remove hyperlinks with URL normalization
- **Undo / redo** — full history support
- **Configurable toolbar** — show only the button groups you need, or none
- **Read-only mode** — render saved content without editing chrome
- **Themeable** — restyle everything with CSS custom properties
- **SSR-safe** — works in Next.js App Router (ships `"use client"`)
- **TypeScript** — fully typed, single rolled-up `.d.ts`
- **Tiny** — ~6 kB of code; React, Tiptap, and icons are shared dependencies, not bundled copies

## Installation

```bash
npm install @sidi-eyel/wysiwyg-editor
```

`react` and `react-dom` (18 or 19) are peer dependencies — you already have them in a React app.

## Quick start

```tsx
import { useState } from "react"
import { WysiwygEditor } from "@sidi-eyel/wysiwyg-editor"
import "@sidi-eyel/wysiwyg-editor/styles"

function App() {
  const [html, setHtml] = useState("<p>Hello world</p>")

  return (
    <WysiwygEditor
      content={html}
      onChange={setHtml}
      placeholder="Start typing..."
    />
  )
}
```

The stylesheet import (`@sidi-eyel/wysiwyg-editor/styles`) is required once per app. `@sidi-eyel/wysiwyg-editor/style.css` works too if your bundler prefers an explicit extension.

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | `""` | HTML content. Changing it from outside replaces the document, so controlled usage works. |
| `onChange` | `(html: string) => void` | — | Called with the editor's HTML on every change. |
| `placeholder` | `string` | `"Start typing..."` | Hint shown while the editor is empty. |
| `toolbar` | `ToolbarGroup[]` | all groups | Which button groups to render, in order. `[]` hides the toolbar. |
| `editable` | `boolean` | `true` | Set to `false` for a read-only view (toolbar is hidden). |
| `autofocus` | `boolean` | `false` | Focus the editor on mount. |
| `minHeight` | `number \| string` | `200` | Minimum height of the writing area (`number` = px). |
| `maxHeight` | `number \| string` | — | Maximum height; content scrolls beyond it. |
| `className` | `string` | `""` | Extra class names for the outer wrapper. |
| `onReady` | `(editor: Editor) => void` | — | Receives the underlying Tiptap `Editor` instance. |

### Toolbar groups

`ToolbarGroup` is one of:

| Group | Buttons |
|-------|---------|
| `formatting` | bold, italic, underline, strikethrough, inline code |
| `headings` | H1, H2, H3 |
| `lists` | bullet list, numbered list |
| `blocks` | blockquote, code block, horizontal rule |
| `align` | left, center, right |
| `link` | add/edit link, remove link |
| `history` | undo, redo |

```tsx
// A minimal comment-box toolbar:
<WysiwygEditor toolbar={["formatting", "link"]} />

// No toolbar at all (keyboard shortcuts still work):
<WysiwygEditor toolbar={[]} />
```

## Theming

All colors and sizes are CSS custom properties on `.wysiwyg-editor-wrapper`. Override the ones you care about:

```css
.my-dark-editor {
  --wysiwyg-bg: #111827;
  --wysiwyg-text: #f9fafb;
  --wysiwyg-border: #374151;
  --wysiwyg-toolbar-bg: #1f2937;
  --wysiwyg-toolbar-text: #d1d5db;
  --wysiwyg-toolbar-hover-bg: #374151;
  --wysiwyg-accent: #60a5fa;
  --wysiwyg-code-bg: #1f2937;
  --wysiwyg-code-text: #f9fafb;
}
```

```tsx
<WysiwygEditor className="my-dark-editor" />
```

Available variables and their defaults:

| Variable | Default | Used for |
|----------|---------|----------|
| `--wysiwyg-bg` | `#ffffff` | Editor background |
| `--wysiwyg-text` | `#1f2937` | Editor text |
| `--wysiwyg-muted` | `#9ca3af` | Placeholder, blockquote text |
| `--wysiwyg-border` | `#e5e7eb` | Borders, separators, rules |
| `--wysiwyg-radius` | `8px` | Wrapper corner radius |
| `--wysiwyg-toolbar-bg` | `#f9fafb` | Toolbar background |
| `--wysiwyg-toolbar-text` | `#374151` | Toolbar icons |
| `--wysiwyg-toolbar-hover-bg` | `#e5e7eb` | Toolbar button hover |
| `--wysiwyg-accent` | `#3b82f6` | Active buttons, links |
| `--wysiwyg-accent-contrast` | `#ffffff` | Icon color on active buttons |
| `--wysiwyg-code-bg` | `#f3f4f6` | Inline code / code block background |
| `--wysiwyg-code-text` | `#1f2937` | Code text |

## Recipes

### Read-only rendering

Render previously saved HTML with the same typography, no editing chrome:

```tsx
<WysiwygEditor content={savedHtml} editable={false} />
```

### Next.js (App Router)

The component ships with `"use client"` and defers rendering to the client (`immediatelyRender: false`), so it works in the App Router without wrappers:

```tsx
// app/editor/page.tsx
"use client"

import { WysiwygEditor } from "@sidi-eyel/wysiwyg-editor"
import "@sidi-eyel/wysiwyg-editor/styles"

export default function Page() {
  return <WysiwygEditor placeholder="Write your post..." />
}
```

### Advanced: drive the Tiptap instance

`onReady` hands you the full [Tiptap `Editor`](https://tiptap.dev/docs/editor/api/editor):

```tsx
import { useRef } from "react"
import { WysiwygEditor, type Editor } from "@sidi-eyel/wysiwyg-editor"

function MyForm() {
  const editorRef = useRef<Editor | null>(null)

  return (
    <>
      <WysiwygEditor onReady={(editor) => (editorRef.current = editor)} />
      <button onClick={() => editorRef.current?.commands.clearContent(true)}>
        Clear
      </button>
    </>
  )
}
```

## Development

```bash
git clone https://github.com/SidiEyel/wysiwyg.git
cd wysiwyg
npm install
npm run dev        # demo app at http://localhost:5173
npm run build      # typecheck + build library to dist/
```

Contributions are welcome — open an [issue](https://github.com/SidiEyel/wysiwyg/issues) or a pull request.

## License

[MIT](./LICENSE) © Sidi Eyel
