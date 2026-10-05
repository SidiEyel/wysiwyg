export type Lang = "en" | "fr" | "ar"

export type Lane = "outreach" | "ads" | "posts"

export type Channel = "email" | "googleSearch" | "linkedin" | "blog"

export type Status = "pending" | "approved" | "changesRequested"

export interface FieldSpec {
  id: string
  /** `line` and `text` are plain text (single- and multi-line); `rich` uses the editor. */
  kind: "line" | "text" | "rich"
  /**
   * Character limit. A `hard` limit is enforced by the platform and blocks
   * approval; a `soft` one only risks truncation.
   */
  limit?: { max: number; kind: "hard" | "soft" }
}

export interface Draft {
  id: string
  lane: Lane
  channel: Channel
  lang: Lang
  /** Who the draft targets, shown to the reviewer as context. */
  audience: string
  /** Minutes since the agent produced the draft. */
  ageMinutes: number
  /** Merge fields the sending system can resolve for this draft. */
  mergeFields: string[]
  /** Field values keyed by `FieldSpec.id`. Rich fields hold HTML. */
  fields: Record<string, string>
}

export const directionOf = (lang: Lang) => (lang === "ar" ? "rtl" : "ltr")
