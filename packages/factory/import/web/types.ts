import { ComponentId, ComponentLevel } from "@seldon/core/components/constants"

import type { FileToExport } from "../../export/types"

/**
 * A DOM element reduced to the parts that matter for component matching. Text
 * content, ids, and volatile attributes are stripped so two elements that play
 * the same functional role compare equal.
 */
export interface FunctionalNode {
  /** Lowercase HTML tag name, such as `div`, `nav`, or `h1`. */
  tag: string
  /** ARIA role, explicit or inferred from the tag, or null when none applies. */
  role: string | null
  /** The Seldon hierarchy level guessed for this node from its tag and shape. */
  level: ComponentLevel
  /**
   * The catalog primitive this leaf seeds from, derived from the HTML tag, or
   * null when the tag has no direct primitive mapping.
   */
  seededComponent: ComponentId | null
  /** True when the node holds its own visible text, not just child elements. */
  hasText: boolean
  children: FunctionalNode[]
}

/**
 * One structurally unique subtree found in the page, with how many times it
 * occurred. The sample is a representative node for the group.
 */
export interface DedupedPiece {
  /** Stable structural signature shared by every occurrence in this group. */
  signature: string
  /** Occurrence count of this signature across the page. */
  count: number
  sample: FunctionalNode
}

/** The outcome of testing one deduped piece against the component catalog. */
export interface MatchResult {
  piece: DedupedPiece
  /** The catalog component this piece maps to, or null when none fit. */
  matched: ComponentId | null
  /** Human-readable explanation of why the piece matched or did not. */
  reason: string
}

/**
 * A draft schema proposal for a piece the catalog cannot build. Shaped like a
 * `ComponentSchema` but emitted as plain JSON for review, never as source.
 */
export interface SuggestedSchema {
  id: string
  level: ComponentLevel
  intent: string
  tags: string[]
  properties: Record<string, unknown>
  default: {
    children: Array<{ component: string }>
  }
}

/** Aggregate counts and identifiers describing one import run. */
export interface ImportWebSummary {
  url: string
  rawNodeCount: number
  dedupedCount: number
  matchedCount: number
  unmatchedCount: number
  suggestions: string[]
}

/** The full result of an import run: files to write plus a summary. */
export interface ImportWebResult {
  files: FileToExport[]
  summary: ImportWebSummary
}
