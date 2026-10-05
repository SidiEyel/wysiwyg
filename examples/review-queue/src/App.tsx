import { useEffect, useMemo, useReducer, useRef, useState } from "react"
import { DraftReview } from "./components/DraftReview"
import { QueueList } from "./components/QueueList"
import { DRAFTS } from "./data/drafts"
import { LANE_LABEL, LOCALES, createTranslator, detectLocale, type Locale } from "./i18n"
import { reviewDraft } from "./review"
import { initialState, isEdited, reducer, statusOf, type Decision } from "./state"
import { directionOf, type Lane } from "./types"

const LANES: (Lane | "all")[] = ["all", "outreach", "ads", "posts"]

function App() {
  const [state, dispatch] = useReducer(reducer, undefined, initialState)
  const [locale, setLocale] = useState<Locale>(detectLocale)
  const [lane, setLane] = useState<Lane | "all">("all")
  const [selectedId, setSelectedId] = useState(DRAFTS[0].id)
  // Narrow screens show the queue and the draft one at a time.
  const [view, setView] = useState<"queue" | "draft">("queue")
  const reviewRef = useRef<HTMLElement>(null)

  const t = useMemo(() => createTranslator(locale), [locale])

  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = directionOf(locale)
  }, [locale])

  const reports = useMemo(
    () => Object.fromEntries(DRAFTS.map((draft) => [draft.id, reviewDraft(draft, state.values[draft.id])])),
    [state.values],
  )

  const inLane = (target: Lane | "all") => DRAFTS.filter((draft) => target === "all" || draft.lane === target)
  const isPending = (draftId: string) => statusOf(state, draftId) === "pending"

  const visible = inLane(lane)
  const selected = DRAFTS.find((draft) => draft.id === selectedId)!
  const reviewedCount = Object.keys(state.decisions).length

  const select = (draftId: string) => {
    setSelectedId(draftId)
    setView("draft")
  }

  const changeLane = (next: Lane | "all") => {
    setLane(next)
    const drafts = inLane(next)
    if (!drafts.includes(selected)) setSelectedId((drafts.find((draft) => isPending(draft.id)) ?? drafts[0]).id)
  }

  const decide = (decision: Decision) => {
    dispatch({ type: "decide", draftId: selected.id, decision })

    // Move on to the next pending draft, wrapping around the visible list.
    const index = visible.indexOf(selected)
    const next = [...visible.slice(index + 1), ...visible.slice(0, index)].find((draft) => isPending(draft.id))
    if (next) setSelectedId(next.id)
    reviewRef.current?.focus()
  }

  const reset = () => {
    dispatch({ type: "reset" })
    setLane("all")
    setSelectedId(DRAFTS[0].id)
    setView("queue")
  }

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <h1>{t("appTitle")}</h1>
          <p>{t("appSubtitle")}</p>
        </div>
        <p className="progress" aria-live="polite">
          <progress value={reviewedCount} max={DRAFTS.length} />
          {t("progress", { done: reviewedCount, total: DRAFTS.length })}
        </p>
        <div className="segmented" role="group" aria-label={t("interfaceLanguage")}>
          {LOCALES.map(({ id, label }) => (
            <button key={id} type="button" lang={id} aria-pressed={id === locale} onClick={() => setLocale(id)}>
              {label}
            </button>
          ))}
        </div>
      </header>

      <main className="layout" data-view={view}>
        <aside className="queue">
          <div className="lanes">
            {LANES.map((id) => (
              <button key={id} type="button" aria-pressed={id === lane} onClick={() => changeLane(id)}>
                {t(LANE_LABEL[id])}
                <span className="lane-count">{inLane(id).filter((draft) => isPending(draft.id)).length}</span>
              </button>
            ))}
          </div>
          {reviewedCount === DRAFTS.length && <p className="queue-done">{t("allReviewed")}</p>}
          <QueueList
            drafts={visible}
            values={state.values}
            reports={reports}
            statusOf={(draftId) => statusOf(state, draftId)}
            selectedId={selected.id}
            onSelect={select}
            t={t}
          />
        </aside>

        <section className="review" ref={reviewRef} tabIndex={-1}>
          {/* Keyed by draft: each one gets a fresh editor and undo history. */}
          <DraftReview
            key={selected.id}
            draft={selected}
            values={state.values[selected.id]}
            reports={reports[selected.id]}
            decision={state.decisions[selected.id]}
            edited={isEdited(state, selected.id)}
            locale={locale}
            t={t}
            onEdit={(fieldId, value) => dispatch({ type: "edit", draftId: selected.id, fieldId, value })}
            onDecide={decide}
            onReopen={() => dispatch({ type: "reopen", draftId: selected.id })}
            onRestore={() => dispatch({ type: "restore", draftId: selected.id })}
            onBack={() => setView("queue")}
          />
        </section>
      </main>

      <footer className="footer">
        <p>
          {t("footerBuiltWith")}{" "}
          <a href="https://www.npmjs.com/package/@sidieyel/wysiwyg-editor" dir="ltr">
            @sidieyel/wysiwyg-editor
          </a>
          {" · "}
          <a href="https://github.com/SidiEyel/wysiwyg/tree/master/examples/review-queue">{t("footerSource")}</a>
          {" · "}
          {t("footerFictional")}
        </p>
        <button type="button" className="link" onClick={reset}>
          {t("reset")}
        </button>
      </footer>
    </div>
  )
}

export default App
