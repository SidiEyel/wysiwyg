import type { Channel, FieldSpec } from "./types"

interface ChannelSpec {
  fields: FieldSpec[]
  /** Field shown as the draft's title in the queue. */
  titleField: string
}

export const CHANNELS: Record<Channel, ChannelSpec> = {
  email: {
    titleField: "subject",
    fields: [
      // Longer subjects are cut off in most inboxes.
      { id: "subject", kind: "line", limit: { max: 60, kind: "soft" } },
      { id: "body", kind: "rich" },
    ],
  },
  googleSearch: {
    titleField: "headline",
    fields: [
      { id: "headline", kind: "line", limit: { max: 30, kind: "hard" } },
      { id: "description", kind: "text", limit: { max: 90, kind: "hard" } },
    ],
  },
  linkedin: {
    titleField: "headline",
    fields: [
      // LinkedIn accepts longer copy but truncates it in the feed.
      { id: "intro", kind: "text", limit: { max: 150, kind: "soft" } },
      { id: "headline", kind: "line", limit: { max: 70, kind: "soft" } },
    ],
  },
  blog: {
    titleField: "title",
    fields: [
      { id: "title", kind: "line", limit: { max: 60, kind: "soft" } },
      { id: "metaDescription", kind: "text", limit: { max: 160, kind: "soft" } },
      { id: "body", kind: "rich" },
    ],
  },
}
