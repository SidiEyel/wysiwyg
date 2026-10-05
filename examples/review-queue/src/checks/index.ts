import type { FieldSpec, Lang } from "../types"
import { findUnknownMergeFields } from "./mergeFields"
import type { TextEdit } from "./text"
import { arabicPunctuationEdits, frenchSpacingEdits } from "./typography"

export { applyEdits, codePointLength } from "./text"
export type { TextEdit } from "./text"

/** Something a check found in a draft. `blocking` findings prevent approval. */
export type Finding =
  | { rule: "frSpacing" | "arPunctuation"; blocking: false; edit: TextEdit }
  | { rule: "mergeField"; blocking: true; name: string; suggestion?: string; edit?: TextEdit }
  | { rule: "length"; blocking: boolean; length: number; max: number }

export interface CheckContext {
  lang: Lang
  mergeFields: readonly string[]
}

/**
 * Runs the content checks on one block of plain text. Edit offsets are
 * relative to `text`.
 */
export function checkText(text: string, { lang, mergeFields }: CheckContext): Finding[] {
  const findings: Finding[] = []

  if (lang === "fr") {
    for (const edit of frenchSpacingEdits(text)) findings.push({ rule: "frSpacing", blocking: false, edit })
  }
  if (lang === "ar") {
    for (const edit of arabicPunctuationEdits(text)) findings.push({ rule: "arPunctuation", blocking: false, edit })
  }
  for (const { name, from, to, suggestion } of findUnknownMergeFields(text, mergeFields)) {
    findings.push({
      rule: "mergeField",
      blocking: true,
      name,
      suggestion,
      edit: suggestion ? { from, to, insert: `{{${suggestion}}}` } : undefined,
    })
  }

  return findings
}

export function checkLength(length: number, limit: NonNullable<FieldSpec["limit"]>): Finding | null {
  if (length <= limit.max) return null
  return { rule: "length", blocking: limit.kind === "hard", length, max: limit.max }
}
