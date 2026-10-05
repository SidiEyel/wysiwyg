# Changelog

## 1.1.0 — 2026-10-05

- New `dir` prop (`"ltr"`, `"rtl"` or `"auto"`) for right-to-left and
  mixed-direction content. The direction is written to the output HTML as
  `dir` attributes, so it survives wherever the HTML is rendered
- Styles use CSS logical properties: lists, blockquotes and the placeholder
  follow the text direction
- Fixed: `onChange` no longer fires on mount or when `editable` changes
- Requires Tiptap 3.11 or later
- New example app in `examples/review-queue`: a review queue for AI-written
  drafts in English, French and Arabic

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
