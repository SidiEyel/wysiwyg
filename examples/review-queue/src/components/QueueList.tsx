import { CircleCheck, CornerUpLeft } from "lucide-react"
import { CHANNELS } from "../channels"
import { CHANNEL_LABEL, STATUS_LABEL, type Translate } from "../i18n"
import type { FieldReport } from "../review"
import { directionOf, type Draft, type Status } from "../types"
import { LANE_ICON } from "./laneIcon"

interface QueueListProps {
  drafts: Draft[]
  values: Record<string, Record<string, string>>
  reports: Record<string, FieldReport[]>
  statusOf: (draftId: string) => Status
  selectedId: string
  onSelect: (draftId: string) => void
  t: Translate
}

export function QueueList({ drafts, values, reports, statusOf, selectedId, onSelect, t }: QueueListProps) {
  if (drafts.length === 0) {
    return <p className="queue-empty">{t("emptyLane")}</p>
  }

  return (
    <ul className="queue-list">
      {drafts.map((draft) => {
        const Icon = LANE_ICON[draft.lane]
        const status = statusOf(draft.id)
        const findings = reports[draft.id].flatMap((report) => report.findings)
        const blocking = findings.filter((finding) => finding.blocking).length

        return (
          <li key={draft.id}>
            <button
              type="button"
              className="queue-item"
              aria-current={draft.id === selectedId ? "true" : undefined}
              data-status={status}
              onClick={() => onSelect(draft.id)}
            >
              <span className="queue-item-meta">
                <Icon size={14} aria-hidden="true" />
                {t(CHANNEL_LABEL[draft.channel])}
                <span className="lang-tag">{draft.lang}</span>
              </span>
              {/* Isolated, not right-aligned: an Arabic title keeps its place in a left-to-right list. */}
              <span className="queue-item-title">
                <bdi lang={draft.lang} dir={directionOf(draft.lang)}>
                  {values[draft.id][CHANNELS[draft.channel].titleField]}
                </bdi>
              </span>
              <span className="queue-item-state">
                {status === "pending" ? (
                  <>
                    {blocking > 0 && <span className="count count-blocking">{blocking}</span>}
                    {findings.length > blocking && (
                      <span className="count count-warning">{findings.length - blocking}</span>
                    )}
                    {findings.length === 0 && <span className="count count-clear">{t("checksPassed")}</span>}
                  </>
                ) : (
                  <span className="queue-item-status">
                    {status === "approved" ? (
                      <CircleCheck size={14} aria-hidden="true" />
                    ) : (
                      <CornerUpLeft size={14} aria-hidden="true" className="flip-rtl" />
                    )}
                    {t(STATUS_LABEL[status])}
                  </span>
                )}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
