/**
 * Design Semantics Types
 *
 * Precise TypeScript types for the design semantics configuration in
 * design-semantics.config.ts. The config is the single source for how a design
 * concept maps to a concrete property edit, so the prompt, the value resolver,
 * and the design linter all read the same rules and cannot drift.
 */

/**
 * One candidate property an intent can write, with optional guards. A guard
 * disambiguates a target that exposes more than one candidate root, for example
 * a bordered text box that exposes both `font` and `border`: `font.weight`
 * guarded to text levels wins over `border.width` there. A bare string is a
 * candidate with no guard.
 */
export interface IntentCandidate {
  /** Dot property path the candidate writes, for example font.weight. */
  path: string
  /** Component levels this candidate applies to, matched case-insensitively. */
  whenLevel?: readonly string[]
  /** Component ids this candidate applies to, matched case-insensitively. */
  whenComponent?: readonly string[]
}

/** One design concept and the properties it can map to. */
export interface IntentRule {
  /** Stable id, used by verb tools and messages. */
  id: string
  /** Words or phrases that name this concept. Matched after normalization. */
  phrases: readonly string[]
  /**
   * Property paths this concept can write, ordered most specific first, for
   * example ["font.size", "size", "width"]. A concept is only deterministic
   * once a target is known, so the resolver picks the first candidate whose
   * root key the target component exposes and whose guards match, rather than
   * assuming one property. A candidate is a bare path or a guarded object.
   */
  candidates: readonly (string | IntentCandidate)[]
  /**
   * Which node the edit lands on relative to the selection. Omitted means the
   * selected node itself. "parent" biases the edit to the container, for a
   * concept that lives on the parent such as the gap between a container's
   * children. A concept-driven tool still falls back to the parent when the
   * selected node does not expose the property but the parent does.
   */
  target?: "self" | "parent"
  /** One-line explanation rendered into the prompt. */
  note: string
}

/** A theme scope's descriptive words mapped to its real token ids. */
export interface TokenScaleSynonyms {
  /** Theme scope the ids belong to, for example fontSize, fontWeight, swatch. */
  scope: string
  /** Normalized spoken word to token id within the scope. */
  synonyms: Readonly<Record<string, string>>
}

/** Which way a relative operation moves along an ordinal scale. */
export type OperationDirection = "increase" | "decrease"

/**
 * A relative verb like "tighten" or "bolder" that steps a concept along its
 * ordinal scale, rather than naming an absolute value. It names the concept it
 * acts on and the direction, so a bare verb resolves to a scale step without the
 * caller restating both.
 */
export interface OperationRule {
  /** Words that name this relative operation. Matched after normalization. */
  phrases: readonly string[]
  /** The intent id this operation steps, for example "spacing" or "weight". */
  concept: string
  /** Which way to move along the scale. */
  direction: OperationDirection
  /** How many steps to move, default 1. */
  steps?: number
}

/**
 * A named spacing density for the whole theme. It sets the theme modulation
 * `baseSize`, which scales the modulated spacing and size tokens together, so
 * "make it breathe" loosens the whole design at once rather than one node.
 */
export interface SpacingFeel {
  /** Stable id, also the value the density tool accepts. */
  id: string
  /** Words that name this density. Matched after normalization. */
  phrases: readonly string[]
  /** The modulation baseSize multiplier this density sets, 1 is the default. */
  baseSize: number
}

/** The whole design semantics source. */
export interface DesignSemanticsConfig {
  /** Intent routing: a concept to its candidate property paths. */
  intents: readonly IntentRule[]
  /** Descriptive word to real token id, per theme scope. */
  tokenSynonyms: readonly TokenScaleSynonyms[]
  /** Relative verbs that step a concept along its ordinal scale. */
  operations: readonly OperationRule[]
  /** Named theme-wide spacing densities, applied through modulation baseSize. */
  spacingFeels: readonly SpacingFeel[]
  /**
   * Spoken interaction-state words mapped to a reserved state name. Keys are
   * normalized (lowercase, alphanumerics only). Values are reserved names from
   * the workspace node-state model, so "greyed out" resolves to "disabled" and
   * "pressed" to "active". A word that is already a reserved name or a workspace
   * custom-state key needs no entry here.
   */
  stateSynonyms: Readonly<Record<string, string>>
}
