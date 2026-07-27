import { getPropertySchema } from "../../properties/schemas/helpers/get-property-schema"
import { getPropertyOptions } from "../../properties/schemas/helpers/property-options"
import type { Theme } from "../../themes/types"
import {
  RESERVED_STATE_NAMES,
  type ReservedStateName,
} from "../../workspace/model/node-state"
import type {
  IntentCandidate,
  IntentRule,
} from "../types/design-semantics-types"
import { designSemantics } from "./design-semantics.config"

/**
 * Lowercases and strips non-alphanumerics, so "Very Small", "very-small", and
 * "verysmall" all match one synonym key. The config keys are stored already
 * normalized, so both sides of a lookup pass through this.
 */
export function normalizeWord(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "")
}

/**
 * The theme value-type tag an atomic key accepts for `@scope.key` references,
 * read from its core schema `supports`, or null when the key takes no theme
 * token. No property supports both theme kinds, so the tag is unambiguous.
 */
function themeTag(
  schemaKey: string,
): "theme.ordinal" | "theme.categorical" | null {
  const supports = getPropertySchema(schemaKey)?.supports
  if (!supports) return null
  if (supports.includes("themeOrdinal")) return "theme.ordinal"
  if (supports.includes("themeCategorical")) return "theme.categorical"
  return null
}

/** The scope and id of an `@scope.id` token, or null when it is not one. */
function parseToken(token: string): { scope: string; id: string } | null {
  if (!token.startsWith("@")) return null
  const dot = token.indexOf(".")
  if (dot === -1) return null
  return { scope: token.slice(1, dot), id: token.slice(dot + 1) }
}

/**
 * The theme scope a property's token list belongs to. Ordinal scales report
 * prefixed tokens (`@fontSize.large`), so the first token parses it directly.
 * Categorical sets like swatch report bare ids (`primary`), so the scope is the
 * theme table whose keys contain every id. Returns null when neither resolves.
 */
function scopeOfTokens(tokens: string[], theme: Theme): string | null {
  const parsed = parseToken(tokens[0]!)
  if (parsed) return parsed.scope
  for (const [scope, table] of Object.entries(
    theme as unknown as Record<string, unknown>,
  )) {
    if (table && typeof table === "object" && !Array.isArray(table)) {
      const keys = table as Record<string, unknown>
      if (tokens.every((token) => token in keys)) return scope
    }
  }
  return null
}

/** A resolved theme token plus the value-type tag it must be stored under. */
export interface ResolvedToken {
  tag: "theme.ordinal" | "theme.categorical"
  token: string
}

/**
 * Resolves a descriptive word to a real theme token for a property, or undefined
 * when nothing matches. It reads the property's live token list from the computed
 * theme, so it only returns a token that exists: a word matches a token id
 * directly or through the scope's synonym map. It always returns the `@scope.id`
 * reference the reducer expects, whether the schema lists tokens prefixed or bare.
 */
export function resolveToken(
  word: string,
  schemaKey: string,
  theme?: Theme,
): ResolvedToken | undefined {
  const tag = themeTag(schemaKey)
  if (!tag || !theme) return undefined
  const valueType = tag === "theme.ordinal" ? "themeOrdinal" : "themeCategorical"
  const tokens = getPropertyOptions(schemaKey, valueType, theme).map(String)
  if (tokens.length === 0) return undefined
  const scope = scopeOfTokens(tokens, theme)
  if (!scope) return undefined

  // Normalize the list to id and `@scope.id` reference, so a prefixed ordinal
  // token and a bare categorical id resolve and return the same reference form.
  const entries = tokens.map((token) => {
    const parsed = parseToken(token)
    const id = parsed ? parsed.id : token
    return { id, token: `@${scope}.${id}` }
  })
  const norm = normalizeWord(word)

  for (const entry of entries) {
    if (normalizeWord(entry.id) === norm) return { tag, token: entry.token }
  }

  const scale = designSemantics.tokenSynonyms.find((s) => s.scope === scope)
  const targetId = scale?.synonyms[norm]
  if (targetId) {
    const entry = entries.find((e) => e.id === targetId)
    if (entry) return { tag, token: entry.token }
  }
  return undefined
}

/** The intent rule a phrase names, matched after normalization, or undefined. */
export function resolveIntentTarget(phrase: string): IntentRule | undefined {
  const norm = normalizeWord(phrase)
  return designSemantics.intents.find((intent) =>
    intent.phrases.some((p) => normalizeWord(p) === norm),
  )
}

/** A relative operation resolved from a verb: which concept and which way. */
export interface ResolvedOperation {
  concept: string
  direction: "increase" | "decrease"
  steps: number
}

/**
 * The relative operation a verb names, for example "tighten" -> spacing down,
 * "bolder" -> weight up, or undefined when nothing matches. Lets a bare verb
 * become a scale step without the caller restating the concept and direction.
 */
export function resolveOperation(phrase: string): ResolvedOperation | undefined {
  const norm = normalizeWord(phrase)
  const rule = designSemantics.operations.find((operation) =>
    operation.phrases.some((p) => normalizeWord(p) === norm),
  )
  if (!rule) return undefined
  return { concept: rule.concept, direction: rule.direction, steps: rule.steps ?? 1 }
}

/**
 * Steps an ordinal token along its scale and returns the new `@scope.id`, or
 * undefined when the scale is empty. `orderedTokens` is the scale in order, as
 * `themeOrdinalKeys` reports it. The current token is matched by id, so a bare
 * id and an `@scope.id` reference both locate the same step. An unknown or unset
 * current value starts from the middle of the scale, so a first nudge moves off
 * a sensible baseline. The result index is clamped to the scale ends.
 */
export function resolveScaleStep(
  currentToken: string | undefined,
  steps: number,
  orderedTokens: readonly string[],
): string | undefined {
  if (orderedTokens.length === 0) return undefined
  const ids = orderedTokens.map((token) => {
    const parsed = parseToken(token)
    return parsed ? parsed.id : token
  })
  const currentId = currentToken
    ? (parseToken(currentToken)?.id ?? currentToken)
    : undefined
  const found = currentId
    ? ids.findIndex((id) => normalizeWord(id) === normalizeWord(currentId))
    : -1
  const startIndex = found === -1 ? Math.floor(ids.length / 2) : found
  const nextIndex = Math.min(
    Math.max(startIndex + steps, 0),
    ids.length - 1,
  )
  return orderedTokens[nextIndex]
}

/** The top-level key a candidate path writes, for example font.size -> font. */
function rootKey(path: string): string {
  const dot = path.indexOf(".")
  return dot === -1 ? path : path.slice(0, dot)
}

/** Normalizes a bare path or a guarded candidate to the object form. */
function asCandidate(candidate: string | IntentCandidate): IntentCandidate {
  return typeof candidate === "string" ? { path: candidate } : candidate
}

/** The target component facts a candidate guard is checked against. */
export interface IntentContext {
  level?: string
  componentId?: string
}

/**
 * Whether a candidate's guards apply to the target. `none` means the candidate
 * carries no guard, `match` means a guard names the target's level or component,
 * and `fail` means a guard is present but the target does not match it, so the
 * candidate is excluded even when its root key is exposed.
 */
function guardState(
  candidate: IntentCandidate,
  context?: IntentContext,
): "none" | "match" | "fail" {
  const hasGuard = candidate.whenLevel || candidate.whenComponent
  if (!hasGuard) return "none"
  const norm = (value: string) => value.toLowerCase()
  if (
    candidate.whenLevel &&
    context?.level &&
    candidate.whenLevel.some((level) => norm(level) === norm(context.level!))
  ) {
    return "match"
  }
  if (
    candidate.whenComponent &&
    context?.componentId &&
    candidate.whenComponent.some(
      (id) => norm(id) === norm(context.componentId!),
    )
  ) {
    return "match"
  }
  return "fail"
}

/** The three outcomes of routing an intent against a target's exposed keys. */
export type IntentPropertyResolution =
  | { status: "resolved"; propertyPath: string }
  | { status: "ambiguous"; candidates: readonly string[] }
  | { status: "unsupported"; candidates: readonly string[] }

/**
 * Routes an intent phrase to a property for a specific target. It gates the
 * ordered candidates against the target's exposed top-level keys and guards, so
 * "size" resolves to `font.size` on text but `width` on a frame. A guarded
 * candidate that names the target's level or component wins the tiebreak;
 * several applicable candidates with no discriminator return "ambiguous".
 */
export function resolveIntentProperty(
  phrase: string,
  exposedKeys: ReadonlySet<string>,
  context?: IntentContext,
): IntentPropertyResolution | undefined {
  const intent = resolveIntentTarget(phrase)
  if (!intent) return undefined

  const allPaths = intent.candidates.map((c) => asCandidate(c).path)
  const applicable = intent.candidates
    .map(asCandidate)
    .filter((candidate) => exposedKeys.has(rootKey(candidate.path)))
    .filter((candidate) => guardState(candidate, context) !== "fail")

  if (applicable.length === 0) {
    return { status: "unsupported", candidates: allPaths }
  }
  const guarded = applicable.find(
    (candidate) => guardState(candidate, context) === "match",
  )
  if (guarded) return { status: "resolved", propertyPath: guarded.path }
  if (applicable.length === 1) {
    return { status: "resolved", propertyPath: applicable[0]!.path }
  }
  return {
    status: "ambiguous",
    candidates: applicable.map((candidate) => candidate.path),
  }
}

/** Every intent rule, for rendering the prompt section and verb tools. */
export function listIntents(): readonly IntentRule[] {
  return designSemantics.intents
}

/** Every named spacing density, for the density tool's choices and the prompt. */
export function listSpacingFeels() {
  return designSemantics.spacingFeels
}

/**
 * The spacing density a word names, matched by id or phrase, or undefined. Lets
 * "breathe", "airy", or "tight" resolve to the modulation baseSize the whole
 * theme scales by.
 */
export function resolveSpacingFeel(
  word: string,
): { id: string; baseSize: number } | undefined {
  const norm = normalizeWord(word)
  const feel = designSemantics.spacingFeels.find(
    (candidate) =>
      normalizeWord(candidate.id) === norm ||
      candidate.phrases.some((phrase) => normalizeWord(phrase) === norm),
  )
  return feel ? { id: feel.id, baseSize: feel.baseSize } : undefined
}

/** One workspace custom state a spoken word can name. */
export interface CustomStateChoice {
  key: string
  label: string
}

/** An interaction state a word resolves to: its stored key and where it comes from. */
export interface ResolvedStateName {
  key: string
  kind: "reserved" | "custom"
}

/**
 * The interaction-state key a spoken word names, or undefined. A word resolves
 * to a reserved state directly, through a synonym (so "greyed out" -> disabled,
 * "pressed" -> active), or to a workspace custom state by its key or label. The
 * returned `key` is the value stored in a node's `states` map. Never resolves
 * "normal", which is the base layer stored in `overrides`, not a state.
 */
export function resolveStateName(
  word: string,
  customStates: readonly CustomStateChoice[] = [],
): ResolvedStateName | undefined {
  const norm = normalizeWord(word)
  if (!norm || norm === "normal") return undefined

  const direct = RESERVED_STATE_NAMES.find(
    (name) => normalizeWord(name) === norm,
  )
  if (direct) return { key: direct, kind: "reserved" }

  const synonym = designSemantics.stateSynonyms[norm]
  if (synonym) return { key: synonym as ReservedStateName, kind: "reserved" }

  const custom = customStates.find(
    (state) =>
      normalizeWord(state.key) === norm || normalizeWord(state.label) === norm,
  )
  if (custom) return { key: custom.key, kind: "custom" }

  return undefined
}

/** Every reserved interaction-state name, for tool choices and messages. */
export function listReservedStateNames(): readonly string[] {
  return RESERVED_STATE_NAMES
}
