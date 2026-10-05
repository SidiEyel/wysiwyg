/** A replacement of `text.slice(from, to)` with `insert`. Offsets are UTF-16 units. */
export interface TextEdit {
  from: number
  to: number
  insert: string
}

/** Applies non-overlapping edits to a string. */
export function applyEdits(text: string, edits: readonly TextEdit[]): string {
  // Back to front, so earlier offsets stay valid.
  return [...edits]
    .sort((a, b) => b.from - a.from)
    .reduce((result, edit) => result.slice(0, edit.from) + edit.insert + result.slice(edit.to), text)
}

/**
 * Length in Unicode code points. Unlike a grapheme count, an Arabic letter
 * and its diacritic count as two, so the result never under-reports against
 * a platform that counts every mark.
 */
export function codePointLength(text: string): number {
  return Array.from(text).length
}
