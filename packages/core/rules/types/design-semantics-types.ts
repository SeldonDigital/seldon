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
 *
 * `path` is the dot property path written, such as `font.weight`. `whenLevel`
 * and `whenComponent` restrict the candidate to matching component levels or
 * ids, matched case-insensitively.
 */
export interface IntentCandidate {
  path: string
  whenLevel?: readonly string[]
  whenComponent?: readonly string[]
}

/**
 * One design concept and the properties it can map to.
 *
 * `id` is a stable id used by verb tools and messages. `phrases` name the
 * concept, matched after normalization. `candidates` are the property paths this
 * concept can write, ordered most specific first, such as
 * `["font.size", "size", "width"]`. A concept is only deterministic once a target
 * is known, so the resolver picks the first candidate whose root key the target
 * exposes and whose guards match, rather than assuming one property. A candidate
 * is a bare path or a guarded object. `note` is a one-line explanation rendered
 * into the prompt. `target` selects the node the edit lands on relative to the
 * selection. Omitted means the selected node itself. "parent" biases the edit to
 * the container, for a concept that lives on the parent such as the gap between a
 * container's children, and a concept-driven tool still falls back to the parent
 * when the selected node does not expose the property but the parent does.
 */
export interface IntentRule {
  id: string
  phrases: readonly string[]
  candidates: readonly (string | IntentCandidate)[]
  note: string
  target?: "self" | "parent"
}

/**
 * A theme scope's descriptive words mapped to its real token ids. `scope` is the
 * theme scope the ids belong to, such as fontSize, fontWeight, or swatch.
 * `synonyms` maps a normalized spoken word to a token id within the scope.
 */
export interface TokenScaleSynonyms {
  scope: string
  synonyms: Readonly<Record<string, string>>
}

/** Which way a relative operation moves along an ordinal scale. */
export type OperationDirection = "increase" | "decrease"

/**
 * A relative verb like "tighten" or "bolder" that steps a concept along its
 * ordinal scale, rather than naming an absolute value. It names the concept it
 * acts on and the direction, so a bare verb resolves to a scale step without the
 * caller restating both.
 *
 * `phrases` name this operation, matched after normalization. `concept` is the
 * intent id it steps, such as "spacing" or "weight". `direction` is which way to
 * move along the scale. `steps` is how many steps to move, default 1.
 */
export interface OperationRule {
  phrases: readonly string[]
  concept: string
  direction: OperationDirection
  steps?: number
}

/**
 * A named spacing density for the whole theme. It sets the theme modulation
 * `baseSize`, which scales the modulated spacing and size tokens together, so
 * "make it breathe" loosens the whole design at once rather than one node.
 *
 * `id` is a stable id, also the value the density tool accepts. `phrases` name
 * this density, matched after normalization. `baseSize` is the modulation
 * baseSize multiplier this density sets, 1 is the default.
 */
export interface SpacingFeel {
  id: string
  phrases: readonly string[]
  baseSize: number
}

/**
 * The whole design semantics source.
 *
 * `intents` route a concept to its candidate property paths. `tokenSynonyms` map
 * a descriptive word to a real token id, per theme scope. `operations` are the
 * relative verbs that step a concept along its ordinal scale. `spacingFeels` are
 * the named theme-wide spacing densities, applied through modulation baseSize.
 * `stateSynonyms` map spoken interaction-state words to a reserved state name.
 * Keys are normalized (lowercase, alphanumerics only). Values are reserved names
 * from the workspace node-state model, so "greyed out" resolves to "disabled" and
 * "pressed" to "active". A word that is already a reserved name or a workspace
 * custom-state key needs no entry here.
 */
export interface DesignSemanticsConfig {
  intents: readonly IntentRule[]
  tokenSynonyms: readonly TokenScaleSynonyms[]
  operations: readonly OperationRule[]
  spacingFeels: readonly SpacingFeel[]
  stateSynonyms: Readonly<Record<string, string>>
}
