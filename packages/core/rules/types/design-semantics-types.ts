/**
 * Design Semantics Types
 *
 * Precise TypeScript types for the design semantics configuration in
 * design-semantics.config.ts. The config is the single source for how a design
 * concept maps to a concrete property edit, so the prompt, the value resolver,
 * and the design linter all read the same rules and cannot drift.
 */

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
   * root key the target component exposes rather than assuming one property.
   */
  candidates: readonly string[]
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

/** The whole design semantics source. */
export interface DesignSemanticsConfig {
  /** Intent routing: a concept to the property path and value source. */
  intents: readonly IntentRule[]
  /** Descriptive word to real token id, per theme scope. */
  tokenSynonyms: readonly TokenScaleSynonyms[]
}
