const MERGE_FIELD = /\{\{\s*([^{}]*?)\s*\}\}/g

export interface UnknownMergeField {
  name: string
  from: number
  to: number
  /** The known field the author most likely meant, if one is close enough. */
  suggestion?: string
}

/**
 * Finds merge fields the sending system cannot resolve. Left alone, they
 * reach the recipient as literal `{{braces}}`.
 */
export function findUnknownMergeFields(text: string, known: readonly string[]): UnknownMergeField[] {
  const unknown: UnknownMergeField[] = []

  for (const match of text.matchAll(MERGE_FIELD)) {
    const name = match[1]
    if (known.includes(name)) continue

    unknown.push({
      name,
      from: match.index,
      to: match.index + match[0].length,
      suggestion: closest(name, known),
    })
  }

  return unknown
}

/** Typos are usually one or two keystrokes away from the intended name. */
const MAX_TYPO_DISTANCE = 2

function closest(name: string, candidates: readonly string[]): string | undefined {
  let best: string | undefined
  let bestDistance = MAX_TYPO_DISTANCE + 1

  for (const candidate of candidates) {
    const distance = editDistance(name.toLowerCase(), candidate.toLowerCase())
    if (distance < bestDistance) {
      best = candidate
      bestDistance = distance
    }
  }

  return best
}

/** Levenshtein distance, keeping only the previous row. */
function editDistance(a: string, b: string): number {
  let previous = Array.from({ length: b.length + 1 }, (_, j) => j)

  for (let i = 1; i <= a.length; i++) {
    const current = [i]
    for (let j = 1; j <= b.length; j++) {
      const substitution = previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
      current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, substitution)
    }
    previous = current
  }

  return previous[b.length]
}
