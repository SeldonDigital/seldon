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
  /**
   * Semantic evidence captured from the DOM. Excluded from the dedupe signature
   * so nodes still group by structure, but carried on the representative sample
   * so matching, suggestions, and classification have real content to work
   * with.
   */
  evidence: NodeEvidence
}

/** Content and attribute signal captured from one DOM element. */
export interface NodeEvidence {
  /** A short sample of the element's own visible text, when present. */
  text?: string
  /** Class tokens on the element, the strongest design-system naming hint. */
  classes?: string[]
  /** Whitelisted attributes that hint at purpose, such as `aria-label`. */
  attrs?: Record<string, string>
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
 * The model's read of one piece: what the component is, where it sits in the
 * hierarchy, and the properties it likely exposes. Every field is best-effort
 * and validated before use, since it comes from a local model.
 */
export interface PieceClassification {
  /** Human-readable component name, such as "Product Card". */
  name: string
  /** camelCase id suggestion derived by the model. */
  id: string
  level: ComponentLevel
  intent: string
  tags: string[]
  /** Free-form property hints the model proposes, if any. */
  properties?: Record<string, unknown>
}

/** Options for the optional AI classification pass over unmatched pieces. */
export interface ClassifyOptions {
  /** Ollama model id. Defaults to the pipeline's built-in default. */
  model?: string
  /** Ollama host base url. Defaults to the local server. */
  host?: string
}

/** Options for one import run. */
export interface RunImportWebOptions {
  /**
   * Classify unmatched pieces with the local model. Pass options to enable, or
   * `false` to stay deterministic. Classification is best-effort: if the model
   * is unreachable, each piece falls back to a heuristic description.
   */
  classify?: ClassifyOptions | false
}

/**
 * A draft schema proposal for a piece the catalog cannot build. Shaped like a
 * `ComponentSchema` but emitted as plain JSON for review, never as source. It
 * carries the evidence and, when available, the model's classification so a
 * reviewer can tell what the piece is.
 */
export interface SuggestedSchema {
  id: string
  /** Human-readable name, from the model when classified, else derived. */
  name: string
  level: ComponentLevel
  intent: string
  tags: string[]
  properties: Record<string, unknown>
  default: {
    children: Array<{ component: string }>
  }
  /** How this suggestion was described: the deterministic pass or the model. */
  source: "heuristic" | "model"
  /** The evidence the suggestion was built from, kept for review. */
  evidence: {
    tag: string
    role: string | null
    count: number
    text?: string
    classes?: string[]
    attrs?: Record<string, string>
    childOutline: string[]
  }
}

/** Aggregate counts and identifiers describing one import run. */
export interface ImportWebSummary {
  url: string
  rawNodeCount: number
  dedupedCount: number
  matchedCount: number
  unmatchedCount: number
  /** How many suggestions were named by the model rather than the heuristic. */
  classifiedCount: number
  suggestions: string[]
}

/** The full result of an import run: files to write plus a summary. */
export interface ImportWebResult {
  files: FileToExport[]
  summary: ImportWebSummary
}
