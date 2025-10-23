# WYSIWYG Editor

A modern, feature-rich WYSIWYG editor built with React and Tiptap.

## Features

- **Rich Text Formatting**: Bold, italic, underline, strikethrough, and code
- **Headings**: H1 and H2 support
- **Lists**: Bullet and numbered lists
- **Text Alignment**: Left, center, and right alignment
- **Links**: Add and manage hyperlinks
- **Undo/Redo**: Full history support
- **TypeScript**: Fully typed for better developer experience

## Installation

\`\`\`bash
npm install @sidi-eyel/wysiwyg-editor
\`\`\`

## Usage

\`\`\`tsx
import { WysiwygEditor } from '@sidi-eyel/wysiwyg-editor'
import '@sidi-eyel/wysiwyg-editor/styles'

function App() {
  const [content, setContent] = useState('')

  return (
    <WysiwygEditor
      content={content}
      onChange={setContent}
      placeholder="Start typing..."
    />
  )
}
\`\`\`

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `content` | `string` | `''` | Initial HTML content |
| `onChange` | `(html: string) => void` | `undefined` | Callback when content changes |
| `placeholder` | `string` | `'Start typing...'` | Placeholder text |
| `className` | `string` | `''` | Additional CSS classes |

## License

MIT
\`\`\`

```file=".npmignore"
src/
node_modules/
.git/
.gitignore
vite.config.ts
tsconfig.json
tsconfig.node.json
index.html
public/
