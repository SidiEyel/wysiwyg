import type { Editor } from "@sidieyel/wysiwyg-editor"
import type { TextEdit } from "./checks"

/**
 * Runs `findEdits` on every text block of the document and applies the
 * result as a single transaction, so one undo reverts the whole fix and the
 * formatting around each edit is kept.
 */
export function applyEditsToEditor(editor: Editor, findEdits: (text: string) => TextEdit[]): void {
  const edits: TextEdit[] = []

  editor.state.doc.descendants((node, pos) => {
    if (!node.isTextblock) return true
    if (!node.type.spec.code) {
      // Every inline leaf (a hard break) takes one character, like it takes
      // one position in the document, so text offsets map straight to positions.
      const text = node.textBetween(0, node.content.size, undefined, "\n")
      const start = pos + 1
      for (const edit of findEdits(text)) {
        edits.push({ from: start + edit.from, to: start + edit.to, insert: edit.insert })
      }
    }
    return false
  })

  if (edits.length === 0) return

  const transaction = editor.state.tr
  // Back to front, so earlier positions stay valid.
  edits.sort((a, b) => b.from - a.from)
  for (const edit of edits) transaction.insertText(edit.insert, edit.from, edit.to)
  editor.view.dispatch(transaction)
}
