import { useEffect, useId, useState, type FormEvent } from "react"
import { ArrowLeft, CircleCheck, CornerUpLeft } from "lucide-react"
import { WysiwygEditor, type Editor, type ToolbarGroup } from "@sidieyel/wysiwyg-editor"
import { applyEdits, checkText } from "../checks"
import { applyEditsToEditor } from "../editor"
import { CHANNEL_LABEL, FIELD_LABEL, LANG_LABEL, STATUS_LABEL, formatAge, type Locale, type Translate } from "../i18n"
import { contextOf, type FieldReport } from "../review"
import type { Decision } from "../state"
import { directionOf, type Channel, type Draft, type FieldSpec } from "../types"
import { ChecksPanel, type FindingMatcher } from "./ChecksPanel"
import { LANE_ICON } from "./laneIcon"

// Alignment is left out on purpose: it follows the direction of the draft.
const TOOLBARS: Partial<Record<Channel, ToolbarGroup[]>> = {
  email: ["formatting", "lists", "link", "history"],
  blog: ["headings", "formatting", "lists", "blocks", "link", "history"],
}

interface DraftReviewProps {
  draft: Draft
  values: Record<string, string>
  reports: FieldReport[]
  decision: Decision | undefined
  edited: boolean
  locale: Locale
  t: Translate
  onEdit: (fieldId: string, value: string) => void
  onDecide: (decision: Decision) => void
  onReopen: () => void
  onRestore: () => void
  onBack: () => void
}

export function DraftReview({
  draft,
  values,
  reports,
  decision,
  edited,
  locale,
  t,
  onEdit,
  onDecide,
  onReopen,
  onRestore,
  onBack,
}: DraftReviewProps) {
  const [editor, setEditor] = useState<Editor | null>(null)
  // `null` while the "request changes" form is closed.
  const [note, setNote] = useState<string | null>(null)
  const noteId = useId()

  const reviewed = decision !== undefined
  const blocked = reports.some((report) => report.findings.some((finding) => finding.blocking))
  const canApprove = !reviewed && !blocked
  const LaneIcon = LANE_ICON[draft.lane]

  useEffect(() => {
    if (!canApprove) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Enter" || !(event.metaKey || event.ctrlKey)) return
      // Handled in the capture phase and stopped here, because the editor
      // binds the same shortcut to a line break.
      event.preventDefault()
      event.stopPropagation()
      onDecide({ status: "approved" })
    }
    window.addEventListener("keydown", onKeyDown, true)
    return () => window.removeEventListener("keydown", onKeyDown, true)
  }, [canApprove, onDecide])

  const fix = (fieldId: string, match: FindingMatcher) => {
    const context = contextOf(draft)
    const findEdits = (text: string) =>
      checkText(text, context).flatMap((finding) => ("edit" in finding && finding.edit && match(finding) ? [finding.edit] : []))

    const field = reports.find((report) => report.field.id === fieldId)!.field
    if (field.kind !== "rich") {
      onEdit(fieldId, applyEdits(values[fieldId], findEdits(values[fieldId])))
    } else if (editor) {
      // Goes through the editor so the fix lands in its undo history.
      applyEditsToEditor(editor, findEdits)
    }
  }

  const sendBack = (event: FormEvent) => {
    event.preventDefault()
    onDecide({ status: "changesRequested", note: note?.trim() || undefined })
  }

  return (
    <article className="draft">
      <header className="draft-head">
        <button type="button" className="back" onClick={onBack}>
          <ArrowLeft size={16} aria-hidden="true" className="flip-rtl" />
          {t("back")}
        </button>
        <p className="draft-meta">
          <LaneIcon size={16} aria-hidden="true" />
          <span>{t(CHANNEL_LABEL[draft.channel])}</span>
          <span>{t(LANG_LABEL[draft.lang])}</span>
          <span>{formatAge(draft.ageMinutes, locale)}</span>
          {edited && <span className="tag">{t("edited")}</span>}
          {edited && !reviewed && (
            <button type="button" className="link" onClick={onRestore}>
              {t("restore")}
            </button>
          )}
        </p>
        <p className="draft-audience">
          <span className="draft-audience-label">{t("audience")}</span>
          <bdi lang={draft.lang} dir={directionOf(draft.lang)}>
            {draft.audience}
          </bdi>
        </p>
      </header>

      {decision && (
        <div className="decision" data-status={decision.status}>
          <p className="decision-status">
            {decision.status === "approved" ? (
              <CircleCheck size={18} aria-hidden="true" />
            ) : (
              <CornerUpLeft size={18} aria-hidden="true" className="flip-rtl" />
            )}
            {t(STATUS_LABEL[decision.status])}
          </p>
          {decision.note && (
            <p className="decision-note">
              <span>{t("noteSent")}</span>
              <bdi>{decision.note}</bdi>
            </p>
          )}
          <button type="button" className="button button-small" onClick={onReopen}>
            {t("reopen")}
          </button>
        </div>
      )}

      <div className="fields">
        {reports.map(({ field, length }) =>
          field.kind === "rich" ? (
            <div className="field" key={field.id} lang={draft.lang}>
              <span className="field-label">{t(FIELD_LABEL[field.id])}</span>
              <WysiwygEditor
                content={values[field.id]}
                onChange={(html) => onEdit(field.id, html)}
                dir={directionOf(draft.lang)}
                editable={!reviewed}
                toolbar={TOOLBARS[draft.channel]}
                minHeight={160}
                placeholder=""
                onReady={setEditor}
              />
            </div>
          ) : (
            <PlainField
              key={field.id}
              field={field}
              label={t(FIELD_LABEL[field.id])}
              value={values[field.id]}
              length={length}
              draft={draft}
              readOnly={reviewed}
              onChange={(value) => onEdit(field.id, value)}
            />
          ),
        )}
      </div>

      <ChecksPanel reports={reports} onFix={reviewed ? undefined : fix} t={t} />

      {!reviewed &&
        (note === null ? (
          <footer className="actions">
            <button type="button" className="button" onClick={() => setNote("")}>
              {t("requestChanges")}
            </button>
            <span className="actions-hint">
              {blocked ? t("blockedHint") : <kbd dir="ltr">⌘/Ctrl + Enter</kbd>}
            </span>
            <button
              type="button"
              className="button button-primary"
              disabled={!canApprove}
              onClick={() => onDecide({ status: "approved" })}
            >
              {t("approve")}
            </button>
          </footer>
        ) : (
          <form className="actions actions-note" onSubmit={sendBack}>
            <label htmlFor={noteId}>{t("noteLabel")}</label>
            <textarea
              id={noteId}
              rows={2}
              dir="auto"
              autoFocus
              value={note}
              placeholder={t("notePlaceholder")}
              onChange={(event) => setNote(event.target.value)}
            />
            <div className="actions-note-buttons">
              <button type="button" className="button" onClick={() => setNote(null)}>
                {t("cancel")}
              </button>
              <button type="submit" className="button button-primary">
                {t("sendBack")}
              </button>
            </div>
          </form>
        ))}
    </article>
  )
}

interface PlainFieldProps {
  field: FieldSpec
  label: string
  value: string
  length: number
  draft: Draft
  readOnly: boolean
  onChange: (value: string) => void
}

function PlainField({ field, label, value, length, draft, readOnly, onChange }: PlainFieldProps) {
  const id = useId()
  const { limit } = field
  const shared = {
    id,
    value,
    readOnly,
    lang: draft.lang,
    dir: directionOf(draft.lang),
    "aria-invalid": limit?.kind === "hard" && length > limit.max ? true : undefined,
  }

  return (
    <div className="field">
      <div className="field-head">
        <label className="field-label" htmlFor={id}>
          {label}
        </label>
        {limit && (
          <span className="counter" data-over={length > limit.max ? limit.kind : undefined} dir="ltr">
            {length} / {limit.max}
          </span>
        )}
      </div>
      {field.kind === "line" ? (
        <input type="text" {...shared} onChange={(event) => onChange(event.target.value)} />
      ) : (
        <textarea rows={3} {...shared} onChange={(event) => onChange(event.target.value)} />
      )}
    </div>
  )
}
