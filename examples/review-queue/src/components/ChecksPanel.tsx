import { CircleAlert, CircleCheck, TriangleAlert } from "lucide-react"
import type { Finding } from "../checks"
import { FIELD_LABEL, type Translate } from "../i18n"
import type { FieldReport } from "../review"

/** Selects the findings a fix button resolves. */
export type FindingMatcher = (finding: Finding) => boolean

interface Row {
  key: string
  fieldId: string
  blocking: boolean
  label: string
  /** Count, offending value or usage, shown next to the label. */
  detail: string
  fix?: { label: string; match: FindingMatcher }
}

interface ChecksPanelProps {
  reports: FieldReport[]
  /** Omitted once the draft is reviewed and can no longer be changed. */
  onFix?: (fieldId: string, match: FindingMatcher) => void
  t: Translate
}

export function ChecksPanel({ reports, onFix, t }: ChecksPanelProps) {
  const rows = reports.flatMap((report) => toRows(report, t))

  return (
    <section className="checks" aria-label={t("checks")}>
      <h3 className="checks-title">{t("checks")}</h3>
      {rows.length === 0 ? (
        <p className="checks-passed">
          <CircleCheck size={16} aria-hidden="true" />
          {t("checksPassed")}
        </p>
      ) : (
        <ul className="checks-list">
          {rows.map((row) => (
            <li key={row.key} className="check" data-blocking={row.blocking || undefined}>
              {row.blocking ? (
                <CircleAlert size={16} aria-label={t("blocking")} />
              ) : (
                <TriangleAlert size={16} aria-hidden="true" />
              )}
              <span className="check-text">
                <span className="check-field">{t(FIELD_LABEL[row.fieldId])}</span>
                {row.label}
                <bdi className="check-detail" dir="ltr">
                  {row.detail}
                </bdi>
              </span>
              {row.fix && onFix && (
                <button
                  type="button"
                  className="button button-small"
                  onClick={() => onFix(row.fieldId, row.fix!.match)}
                >
                  {row.fix.label}
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

function toRows({ field, findings }: FieldReport, t: Translate): Row[] {
  const rows: Row[] = []
  const row = (id: string, rest: Omit<Row, "key" | "fieldId">) =>
    rows.push({ key: `${field.id}:${id}`, fieldId: field.id, ...rest })

  // Typography findings are many small edits of one kind: show them as a
  // single row with one fix.
  for (const rule of ["frSpacing", "arPunctuation"] as const) {
    const count = findings.filter((finding) => finding.rule === rule).length
    if (count === 0) continue
    row(rule, {
      blocking: false,
      label: t(rule === "frSpacing" ? "ruleFrSpacing" : "ruleArPunctuation"),
      detail: `× ${count}`,
      fix: { label: t("fix"), match: (finding) => finding.rule === rule },
    })
  }

  const seenFields = new Set<string>()
  for (const finding of findings) {
    if (finding.rule === "mergeField" && !seenFields.has(finding.name)) {
      seenFields.add(finding.name)
      const { name, suggestion } = finding
      row(`mergeField:${name}`, {
        blocking: true,
        label: t("ruleMergeField"),
        detail: `{{${name}}}`,
        fix: suggestion
          ? {
              label: t("useField", { field: `{{${suggestion}}}` }),
              match: (other) => other.rule === "mergeField" && other.name === name,
            }
          : undefined,
      })
    } else if (finding.rule === "length") {
      row("length", {
        blocking: finding.blocking,
        label: t(finding.blocking ? "ruleLengthHard" : "ruleLengthSoft", { max: finding.max }),
        detail: `${finding.length} / ${finding.max}`,
      })
    }
  }

  return rows
}
