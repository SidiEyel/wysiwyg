# Changelog

## 1.0.0 — 2026-08-11

First public release.

- `WysiwygEditor` React component built on Tiptap v3
- Formatting: bold, italic, underline, strikethrough, inline code
- Headings (H1–H3), bullet/numbered lists, blockquote, code block, horizontal rule
- Text alignment, links (add/edit/remove with URL normalization), undo/redo
- Configurable toolbar groups (`toolbar` prop), read-only mode (`editable`),
  `autofocus`, `minHeight`/`maxHeight`, `onReady` for direct Tiptap access
- Placeholder support
- Theming via `--wysiwyg-*` CSS custom properties
- SSR-safe (`"use client"`, client-only rendering) for Next.js App Router
- ESM + CJS builds with rolled-up TypeScript declarations
