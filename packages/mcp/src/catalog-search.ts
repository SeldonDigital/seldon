import { catalog } from "@seldon/core/components/catalog/index"
import { FONT_COLLECTIONS } from "@seldon/core/font-collections/catalog/index"
import { iconIds, iconLabels } from "@seldon/core/icon-sets"
import { getIconCategoryFromId } from "@seldon/core/icon-sets/helpers/get-icon-category-from-id"
import { THEMES } from "@seldon/core/themes/catalog/index"

import { ICON_TAGS } from "./icon-tags"
import { ICON_TAG_OVERRIDES } from "./icon-tags-overrides"
import { CURATED_SYNONYMS } from "./search-synonyms"

/**
 * Keyword search over the full packaged catalog:
 * components, icons, themes, font collections. Deterministic,
 * dependency-free, and the permanent ranking floor.
 *
 * Hybrid ranking: the caller may pass per-entry semantic scores
 * (cosine similarity from the optional embedding runtime, already calibrated
 * into a 0..<1 band by semantic-search.ts). They fuse via max() with the
 * keyword score, so a keyword hit never loses rank to an embedding score,
 * and the >1 exact-identity band stays keyword-only.
 */
export type SearchKind = "component" | "icon" | "theme" | "fontCollection"

export interface SearchResult {
  id: string
  kind: SearchKind
  level?: string
  intent: string
  /**
   * Relative rank; meaningful for ordering, not across queries. Partial
   * matches score ≤1; exact whole-query identity exceeds 1.
   */
  score: number
}

export interface SearchEntry {
  id: string
  kind: SearchKind
  level?: string
  intent: string
  idLower: string
  nameLower: string
  /** Words from id + display name (camelCase and punctuation split). */
  nameWords: string[]
  tagWords: string[]
  intentWords: string[]
  /** Secondary material: icon category path, theme description, … */
  extraWords: string[]
  /**
   * The passage the build-time embedding index encodes for this entry
   * (scripts/build-search-index.ts). Built here so the vectors and the
   * keyword index can never describe different corpora.
   */
  embeddingText: string
}

/** "cardStacked", "material-shopping_cart" → ["card","stacked"], … */
function splitWords(text: string): string[] {
  return text
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
}

function makeEntry(
  base: Omit<SearchEntry, "idLower" | "nameLower" | "nameWords"> & {
    name: string
  },
): SearchEntry {
  const { name, ...rest } = base
  return {
    ...rest,
    idLower: base.id.toLowerCase(),
    nameLower: name.toLowerCase(),
    nameWords: [...new Set([...splitWords(name), ...splitWords(base.id)])],
  }
}

let cachedIndex: SearchEntry[] | null = null

/**
 * The shared catalog corpus, built lazily once per process (the packaged
 * catalog is immutable). Exported for the build-time embedding index and the
 * eval harness; entry order is deterministic but consumers must key vectors
 * by entry id, not position.
 */
export function getCatalogEntries(): SearchEntry[] {
  if (cachedIndex) return cachedIndex

  const entries: SearchEntry[] = []

  for (const bucket of Object.values(catalog)) {
    for (const schema of bucket) {
      entries.push(
        makeEntry({
          id: schema.id,
          kind: "component",
          level: schema.level,
          intent: schema.intent,
          name: schema.name,
          tagWords: [...new Set(schema.tags.flatMap(splitWords))],
          intentWords: splitWords(schema.intent),
          extraWords: [],
          embeddingText:
            `${schema.name} (${schema.level} component). ${schema.intent} ` +
            `Tags: ${schema.tags.join(", ")}.`,
        }),
      )
    }
  }

  for (const iconId of iconIds) {
    if (iconId.startsWith("__")) continue // reserved sentinel, not an icon
    const label = (iconLabels as Record<string, string>)[iconId] ?? iconId
    const categoryPath = getIconCategoryFromId(iconId)
    // Upstream search aliases (icon-tags.ts) supply the concept vocabulary
    // the label lacks: "Renew" ← refresh/restart, "Close" ← x/dismiss.
    // Hand-curated overrides (icon-tags-overrides.ts) patch icons whose
    // upstream data is too sparse to find by a natural query.
    const tags = [
      ...(ICON_TAGS[iconId] ?? []),
      ...(ICON_TAG_OVERRIDES[iconId] ?? []),
    ]
    entries.push(
      makeEntry({
        id: iconId,
        kind: "icon",
        intent: `${label} (${categoryPath})`,
        name: label,
        tagWords: [...new Set(tags.flatMap(splitWords))],
        intentWords: [],
        extraWords: splitWords(categoryPath),
        embeddingText:
          `${label} icon.` +
          (tags.length > 0 ? ` Tags: ${tags.join(", ")}.` : "") +
          ` Category: ${categoryPath}.`,
      }),
    )
  }

  for (const theme of THEMES) {
    entries.push(
      makeEntry({
        id: theme.id,
        kind: "theme",
        intent: theme.metadata.intent,
        name: theme.metadata.name,
        tagWords: [],
        intentWords: splitWords(theme.metadata.intent),
        extraWords: splitWords(theme.metadata.description),
        embeddingText:
          `${theme.metadata.name} theme. ${theme.metadata.intent} ` +
          theme.metadata.description,
      }),
    )
  }

  for (const collection of FONT_COLLECTIONS) {
    entries.push(
      makeEntry({
        id: collection.id,
        kind: "fontCollection",
        intent: collection.metadata.intent,
        name: collection.metadata.name,
        tagWords: [],
        intentWords: splitWords(collection.metadata.intent),
        extraWords: splitWords(collection.metadata.description),
        embeddingText:
          `${collection.metadata.name} font collection. ` +
          `${collection.metadata.intent} ${collection.metadata.description}`,
      }),
    )
  }

  cachedIndex = entries
  return entries
}

/** Best match quality of one query term against one entry. */
function termScore(term: string, entry: SearchEntry): number {
  if (term === entry.idLower || entry.nameWords.includes(term)) return 1
  if (entry.tagWords.includes(term)) return 0.7

  const prefixable = term.length >= 3
  if (prefixable && entry.nameWords.some((word) => word.startsWith(term))) {
    return 0.8
  }

  for (const expansion of CURATED_SYNONYMS[term] ?? []) {
    if (
      expansion === entry.idLower ||
      entry.nameWords.includes(expansion) ||
      entry.tagWords.includes(expansion)
    ) {
      return 0.6
    }
  }

  if (entry.nameLower.includes(term) || entry.idLower.includes(term)) {
    return 0.5
  }
  if (entry.extraWords.includes(term)) return 0.45
  if (entry.intentWords.includes(term)) return 0.35
  if (prefixable && entry.extraWords.some((word) => word.startsWith(term))) {
    return 0.35
  }
  if (prefixable && entry.intentWords.some((word) => word.startsWith(term))) {
    return 0.25
  }
  return 0
}

/** Entries scoring below this are noise, not results (feeds zero-result logging). */
export const SCORE_THRESHOLD = 0.25

/**
 * Filler words carry no signal against catalog vocabulary but drag every
 * entry's term-average down and let junk entries ("Move To" matching "to")
 * crowd the top-8. Dropped from QUERIES only — entry material keeps them so
 * names like "To-Do Widget" still index under their content words.
 */
const QUERY_STOPWORDS = new Set([
  "a",
  "an",
  "and",
  "for",
  "in",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "with",
])

/**
 * Hard ceiling on any semantic contribution: strictly below a single
 * exact keyword word-match (1.0), so embeddings reorder the fuzzy band but
 * never outrank keyword hits. semantic-search.ts calibrates under this cap;
 * the clamp here is the invariant, not the calibration.
 */
export const SEMANTIC_SCORE_CEILING = 0.95

const KIND_ORDER: Record<SearchKind, number> = {
  component: 0,
  icon: 1,
  theme: 2,
  fontCollection: 3,
}

/**
 * Scores the whole catalog against a free-text query. Returns every entry
 * above threshold, best first; the caller applies kind/target filters and the
 * result limit. Ties break by kind (components first), then id — fully
 * deterministic.
 *
 * `semanticScores` (entry id → calibrated 0..<1 score) comes from the
 * optional embedding runtime; when present, an entry's score is the max of
 * its keyword and semantic scores (hybrid). Absent, this is exactly
 * the plain keyword ranking.
 */
export function searchCatalogIndex(
  query: string,
  kind?: SearchKind,
  semanticScores?: ReadonlyMap<string, number>,
): SearchResult[] {
  const allTerms = splitWords(query)
  const contentTerms = allTerms.filter((term) => !QUERY_STOPWORDS.has(term))
  // All-stopword queries ("of the") fall back to the literal terms.
  const terms = contentTerms.length > 0 ? contentTerms : allTerms
  if (terms.length === 0) return []

  const normalizedQuery = terms.join(" ")
  const results: SearchResult[] = []

  for (const entry of getCatalogEntries()) {
    if (kind && entry.kind !== kind) continue

    let total = 0
    for (const term of terms) total += termScore(term, entry)
    let score = total / terms.length

    const semantic = semanticScores?.get(entry.id)
    if (semantic !== undefined) {
      score = Math.max(score, Math.min(semantic, SEMANTIC_SCORE_CEILING))
    }

    if (score < SCORE_THRESHOLD) continue

    // Exact whole-query identity strictly outranks every partial match
    // — the bonus deliberately pushes past 1, above the ≤1 band
    // keyword and embedding scores live in.
    if (
      normalizedQuery === entry.idLower ||
      normalizedQuery === entry.nameWords.join(" ")
    ) {
      score += 0.1
    }

    results.push({
      id: entry.id,
      kind: entry.kind,
      ...(entry.level ? { level: entry.level } : {}),
      intent: entry.intent,
      score: Math.round(score * 1000) / 1000,
    })
  }

  results.sort(
    (a, b) =>
      b.score - a.score ||
      KIND_ORDER[a.kind] - KIND_ORDER[b.kind] ||
      a.id.localeCompare(b.id),
  )
  return results
}

/**
 * Cuts the ranked list to `limit`. With `diversify` (kind-unfiltered
 * searches), every kind is guaranteed up to `kindQuota` slots: the icon
 * catalog outnumbers everything else ~130:1, so a paraphrase query aimed at
 * a component ("photograph placeholder" → image) would otherwise fill all
 * slots with icons before the right answer surfaced. Retrieve-then-choose
 * needs the choice to actually be on the page; ordering is untouched
 * — diversity only decides which tail entries yield their seats.
 *
 * `kindQuota` > 1 also covers the case where a kind already has ONE
 * representative in the raw top `limit` (so the quota-1 rule leaves it
 * alone) but a SECOND, equally relevant entry of that same kind is sitting
 * just outside — e.g. two components tie for one query ("top navigation
 * with links" → nav and bar) and only the higher-scoring one would
 * otherwise ever surface.
 */
export function selectTopResults(
  results: SearchResult[],
  limit: number,
  diversify: boolean,
  kindQuota = 2,
): SearchResult[] {
  if (!diversify || results.length <= limit) return results.slice(0, limit)

  const picked = results.slice(0, limit)
  const pickedIds = new Set(picked.map((result) => result.id))

  // Which of the raw top `limit` are each their own kind's within-quota
  // seats (protected) vs. extra copies of an already-well-represented kind
  // (surplus, evictable to make room)? Walking `picked` in score order
  // means "first `kindQuota` seen per kind" is that kind's best.
  const seenByKind = new Map<SearchKind, number>()
  const protectedIds = new Set<string>()
  for (const result of picked) {
    const seen = seenByKind.get(result.kind) ?? 0
    if (seen < kindQuota) protectedIds.add(result.id)
    seenByKind.set(result.kind, seen + 1)
  }

  // Walk the full ranking once; for each kind still under quota, take its
  // next-best not-yet-picked entries (results are sorted, so this is each
  // kind's best remaining candidates, in order).
  const countByKind = new Map(seenByKind)
  const injections: SearchResult[] = []
  for (const result of results) {
    if (pickedIds.has(result.id)) continue
    const have = countByKind.get(result.kind) ?? 0
    if (have >= kindQuota) continue
    injections.push(result)
    countByKind.set(result.kind, have + 1)
  }
  if (injections.length === 0) return picked

  // Make room by evicting surplus first (lowest-scored surplus first); only
  // reach into protected seats if there isn't enough surplus to clear —
  // this is what stops a same-kind injection from evicting the very seat
  // that already satisfies that kind's quota.
  const surplus = picked.filter((result) => !protectedIds.has(result.id))
  const protectedPicks = picked.filter((result) => protectedIds.has(result.id))
  // Reverse each group on its own (worst-of-group first), THEN concatenate
  // surplus ahead of protected — reversing the concatenation as a whole
  // would put protected picks first, evicting them before any surplus.
  const evictionOrder = [...surplus.reverse(), ...protectedPicks.reverse()]
  const evicted = new Set(
    evictionOrder.slice(0, injections.length).map((result) => result.id),
  )

  return [...picked.filter((result) => !evicted.has(result.id)), ...injections]
}
