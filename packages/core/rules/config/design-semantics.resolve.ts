import { getPropertySchema } from "../../properties/schemas/helpers/get-property-schema"
import { getPropertyOptions } from "../../properties/schemas/helpers/property-options"
import type { Theme } from "../../themes/types"
import type { IntentRule } from "../types/design-semantics-types"
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
 * when nothing matches. It reads the property's live token list from the
 * computed theme, so it only ever returns a token that exists: a word matches a
 * token id directly, or through the scope's synonym map in the config. This lets
 * "make it big" become `@fontSize.xxlarge` and "primary" become `@swatch.primary`
 * without the model memorizing the scale, and never invents a token a theme does
 * not carry. It always returns the `@scope.id` reference the reducer expects,
 * whether the schema lists tokens prefixed or bare.
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

/** The top-level key a candidate path writes, for example font.size -> font. */
function rootKey(path: string): string {
  const dot = path.indexOf(".")
  return dot === -1 ? path : path.slice(0, dot)
}

/**
 * The property an intent resolves to for a specific target, or its candidates
 * when the target exposes none of them. A concept like "size" is ambiguous
 * until a target is known, so this gates the ordered candidates against the
 * component's exposed top-level keys and returns the first that fits. Callers
 * pass the target's settable keys, so the same concept routes to `font.size` on
 * text and `width` on a frame without the config assuming one property.
 */
export type IntentPropertyResolution =
  | { status: "resolved"; propertyPath: string }
  | { status: "unsupported"; candidates: readonly string[] }

export function resolveIntentProperty(
  phrase: string,
  exposedKeys: ReadonlySet<string>,
): IntentPropertyResolution | undefined {
  const intent = resolveIntentTarget(phrase)
  if (!intent) return undefined
  const match = intent.candidates.find((path) => exposedKeys.has(rootKey(path)))
  if (match) return { status: "resolved", propertyPath: match }
  return { status: "unsupported", candidates: intent.candidates }
}

/** Every intent rule, for rendering the prompt section and verb tools. */
export function listIntents(): readonly IntentRule[] {
  return designSemantics.intents
}
