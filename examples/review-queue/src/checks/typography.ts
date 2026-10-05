import type { TextEdit } from "./text"

const NBSP = " "
const NARROW_NBSP = " "

const isNoBreakSpace = (ch: string | undefined) => ch === NBSP || ch === NARROW_NBSP
const isWhitespace = (ch: string | undefined) => ch !== undefined && /\s/.test(ch)

/**
 * French typography sets a no-break space before `: ; ! ?` and inside
 * guillemets, so the mark never wraps onto its own line. Returns the edits
 * that add the space or replace a breaking one.
 */
export function frenchSpacingEdits(text: string): TextEdit[] {
  const edits: TextEdit[] = []

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    let edit: TextEdit | null = null

    if (ch === ":" || ch === ";") {
      // Only when it ends a clause: skips "10:30", "https://" and ":)".
      if (endsClause(text[i + 1])) edit = spaceBefore(text, i, ch === ":" ? NBSP : NARROW_NBSP, HIGH_PUNCTUATION)
    } else if (ch === "!" || ch === "?") {
      if (endsClause(text[i + 1]) || /[!?»)\]"”’…]/.test(text[i + 1])) {
        edit = spaceBefore(text, i, NARROW_NBSP, HIGH_PUNCTUATION)
      }
    } else if (ch === "»") {
      edit = spaceBefore(text, i, NBSP)
    } else if (ch === "«") {
      edit = spaceAfter(text, i, NBSP)
    }

    if (edit) edits.push(edit)
  }

  return edits
}

const HIGH_PUNCTUATION = /[:;!?]/
const endsClause = (next: string | undefined) => next === undefined || isWhitespace(next)

/** `notAfter` skips a mark that follows one of the given characters, e.g. the "!" in "?!". */
function spaceBefore(text: string, index: number, space: string, notAfter?: RegExp): TextEdit | null {
  let start = index
  while (start > 0 && text[start - 1] === " ") start--

  const previous = text[start - 1]
  if (previous === undefined || isNoBreakSpace(previous) || isWhitespace(previous)) return null
  // An opening guillemet gets its space from the "«" rule.
  if (previous === "«" || notAfter?.test(previous)) return null
  // Punctuation that belongs to a URL, e.g. "https://example.com/?".
  if (text.slice(text.lastIndexOf(" ", start - 1) + 1, index).includes("://")) return null

  return { from: start, to: index, insert: space }
}

function spaceAfter(text: string, index: number, space: string): TextEdit | null {
  let end = index + 1
  while (text[end] === " ") end++

  const next = text[end]
  if (next === undefined || isNoBreakSpace(next) || next === "»") return null

  return { from: index + 1, to: end, insert: space }
}

const ARABIC_MARKS = new Map([
  [",", "،"],
  [";", "؛"],
  ["?", "؟"],
])

const MERGE_FIELD = /\{\{[^{}]*\}\}/g
const isDigit = (ch: string | undefined) => ch !== undefined && /\p{Nd}/u.test(ch)
const isArabicLetter = (ch: string | undefined) => ch !== undefined && /\p{Script=Arabic}/u.test(ch)

/**
 * Arabic has its own comma, semicolon and question mark. Returns the edits
 * that replace the Latin marks wherever they sit next to Arabic text; Latin
 * phrases, URLs and numbers inside the text are left alone.
 */
export function arabicPunctuationEdits(text: string): TextEdit[] {
  // A merge field is replaced at send time, so its Latin name says nothing
  // about the script around it. Masking keeps the offsets intact.
  const masked = text.replace(MERGE_FIELD, (field) => " ".repeat(field.length))
  const edits: TextEdit[] = []

  for (let i = 0; i < masked.length; i++) {
    const replacement = ARABIC_MARKS.get(masked[i])
    if (!replacement) continue
    // Thousands or decimal separator.
    if (isDigit(masked[i - 1]) && isDigit(masked[i + 1])) continue

    if (isArabicLetter(nearestLetter(masked, i, -1)) || isArabicLetter(nearestLetter(masked, i, 1))) {
      edits.push({ from: i, to: i + 1, insert: replacement })
    }
  }

  return edits
}

function nearestLetter(text: string, index: number, step: -1 | 1): string | undefined {
  for (let i = index + step; i >= 0 && i < text.length; i += step) {
    if (/\p{L}/u.test(text[i])) return text[i]
  }
  return undefined
}
