import { DRAFTS } from "./data/drafts"
import type { Status } from "./types"

export type Decision = { status: Exclude<Status, "pending">; note?: string }

export interface ReviewState {
  /** Current field values per draft, starting from what the agent wrote. */
  values: Record<string, Record<string, string>>
  /** Reviewed drafts. A draft without a decision is pending. */
  decisions: Record<string, Decision>
}

export type Action =
  | { type: "edit"; draftId: string; fieldId: string; value: string }
  | { type: "decide"; draftId: string; decision: Decision }
  | { type: "reopen"; draftId: string }
  | { type: "restore"; draftId: string }
  | { type: "reset" }

const original = (draftId: string) => DRAFTS.find((draft) => draft.id === draftId)!.fields

export function initialState(): ReviewState {
  return {
    values: Object.fromEntries(DRAFTS.map((draft) => [draft.id, draft.fields])),
    decisions: {},
  }
}

export function reducer(state: ReviewState, action: Action): ReviewState {
  switch (action.type) {
    case "edit":
      return {
        ...state,
        values: {
          ...state.values,
          [action.draftId]: { ...state.values[action.draftId], [action.fieldId]: action.value },
        },
      }
    case "decide":
      return { ...state, decisions: { ...state.decisions, [action.draftId]: action.decision } }
    case "reopen": {
      const decisions = { ...state.decisions }
      delete decisions[action.draftId]
      return { ...state, decisions }
    }
    case "restore":
      return { ...state, values: { ...state.values, [action.draftId]: original(action.draftId) } }
    case "reset":
      return initialState()
  }
}

export const statusOf = (state: ReviewState, draftId: string): Status => state.decisions[draftId]?.status ?? "pending"

export const isEdited = (state: ReviewState, draftId: string): boolean => {
  const current = state.values[draftId]
  return Object.entries(original(draftId)).some(([fieldId, value]) => current[fieldId] !== value)
}
