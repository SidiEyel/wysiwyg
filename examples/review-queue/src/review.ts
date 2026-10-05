import { CHANNELS } from "./channels"
import { checkLength, checkText, codePointLength, type CheckContext, type Finding } from "./checks"
import type { Draft, FieldSpec } from "./types"

export interface FieldReport {
  field: FieldSpec
  /** Characters used, for fields with a limit. */
  length: number
  findings: Finding[]
}

export const contextOf = (draft: Draft): CheckContext => ({ lang: draft.lang, mergeFields: draft.mergeFields })

/** Runs every check on a draft's current field values. */
export function reviewDraft(draft: Draft, values: Record<string, string>): FieldReport[] {
  const context = contextOf(draft)

  return CHANNELS[draft.channel].fields.map((field) => {
    const value = values[field.id] ?? ""
    const blocks = field.kind === "rich" ? htmlToBlocks(value) : [value]
    const findings = blocks.flatMap((block) => checkText(block, context))

    const length = field.kind === "rich" ? 0 : codePointLength(value)
    const overLimit = field.limit && checkLength(length, field.limit)

    return { field, length, findings: overLimit ? [...findings, overLimit] : findings }
  })
}

/**
 * Plain text of each text block in the editor's HTML. A `<br>` becomes one
 * character so the text matches what `applyEditsToEditor` sees in the document.
 */
function htmlToBlocks(html: string): string[] {
  const doc = new DOMParser().parseFromString(html, "text/html")
  doc.querySelectorAll("br").forEach((br) => br.replaceWith("\n"))
  return Array.from(doc.querySelectorAll("p, h1, h2, h3, h4, h5, h6"), (block) => block.textContent ?? "")
}
