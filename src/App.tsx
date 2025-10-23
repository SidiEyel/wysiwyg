"use client"

import { useState } from "react"
import { WysiwygEditor } from "./WysiwygEditor"
import "./wysiwyg-editor.css"

function App() {
  const [content, setContent] = useState("<p>Start editing...</p>")

  return (
    <div style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}>
      <h1>WYSIWYG Editor Demo</h1>
      <p style={{ color: "#666", marginBottom: "2rem" }}>Test your editor component before using it</p>

      <WysiwygEditor content={content} onChange={setContent} placeholder="Type something..." />

      <div style={{ marginTop: "2rem" }}>
        <h2>HTML Output:</h2>
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
    </div>
  )
}

export default App
