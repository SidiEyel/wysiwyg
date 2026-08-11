"use client"

import { useState } from "react"
import { WysiwygEditor, type ToolbarGroup } from "./WysiwygEditor"

const PRESETS: Record<string, ToolbarGroup[]> = {
  Full: ["formatting", "headings", "lists", "blocks", "align", "link", "history"],
  Comment: ["formatting", "link"],
  Minimal: [],
}

function App() {
  const [content, setContent] = useState("<p>Start editing...</p>")
  const [preset, setPreset] = useState<keyof typeof PRESETS>("Full")
  const [dark, setDark] = useState(false)
  const [readOnly, setReadOnly] = useState(false)

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <h1>WYSIWYG Editor Demo</h1>
      <p style={{ color: "#666", marginBottom: "1.5rem" }}>
        Try the toolbar presets, dark theme, and read-only mode.
      </p>

      <div style={{ display: "flex", gap: "1.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <label>
          Toolbar:{" "}
          <select value={preset} onChange={(e) => setPreset(e.target.value as keyof typeof PRESETS)}>
            {Object.keys(PRESETS).map((name) => (
              <option key={name}>{name}</option>
            ))}
          </select>
        </label>
        <label>
          <input type="checkbox" checked={dark} onChange={(e) => setDark(e.target.checked)} /> Dark theme
        </label>
        <label>
          <input type="checkbox" checked={readOnly} onChange={(e) => setReadOnly(e.target.checked)} /> Read-only
        </label>
      </div>

      <WysiwygEditor
        content={content}
        onChange={setContent}
        placeholder="Type something..."
        toolbar={PRESETS[preset]}
        editable={!readOnly}
        minHeight={220}
        maxHeight="50vh"
        className={dark ? "demo-dark" : ""}
      />

      <div style={{ marginTop: "2rem" }}>
        <h2>HTML output</h2>
        <pre
          style={{
            background: "#f5f5f5",
            padding: "1rem",
            borderRadius: "4px",
            overflow: "auto",
          }}
        >
          {content}
        </pre>
      </div>

      <style>{`
        .demo-dark {
          --wysiwyg-bg: #111827;
          --wysiwyg-text: #f9fafb;
          --wysiwyg-muted: #6b7280;
          --wysiwyg-border: #374151;
          --wysiwyg-toolbar-bg: #1f2937;
          --wysiwyg-toolbar-text: #d1d5db;
          --wysiwyg-toolbar-hover-bg: #374151;
          --wysiwyg-accent: #60a5fa;
          --wysiwyg-accent-contrast: #111827;
          --wysiwyg-code-bg: #1f2937;
          --wysiwyg-code-text: #f9fafb;
        }
      `}</style>
    </div>
  )
}

export default App
