import { themeSwatchToCssBackground } from "@seldon/core/helpers/color/theme-swatch-to-css-background"
import { isValidColor } from "@seldon/core/helpers/validation/color"
import { getPresetOptions } from "@seldon/core/properties/schemas/helpers/property-options"
import { isSwatchToken } from "@seldon/core/themes/values"
import { computeWorkspaceThemes } from "@seldon/core/workspace/compute"
import type { Workspace } from "@seldon/core/workspace/types"

import { themeRefTag } from "../../prompt/property-taxonomy"
import { buildMatchCssColorStage } from "../../prompt/stages/match-css-color"
import type { ColorSwatchChoice } from "../../prompt/stages/resolve-color-name"
import { buildResolveColorNameStage } from "../../prompt/stages/resolve-color-name"
import { CSS_COLOR_NAMES, cssColorHex } from "../../shared/css-colors"
import { callOllamaFormat } from "../ollama-client"
import { type TurnContext, recordStep } from "../turn-context"
import type { PropertyValueResolution } from "./resolve-property-value"

/**
 * The flattened schema keys whose theme tokens are swatches. These take the
 * dedicated color path: their exact values must be structured color literals
 * (hex/hsl/rgb/lch -- Core rejects CSS color names), and their swatch
 * references must be stored in the full `@swatch.<key>` form, neither of
 * which the generic value stage can guarantee.
 */
const SWATCH_COLOR_SCHEMA_KEYS: ReadonlySet<string> = new Set([
  "color",
  "accentColor",
  "backgroundColor",
  "borderColor",
  "shadowColor",
  "gradientStopColor",
])

/** True when the property's value should resolve through the color pipeline. */
export function isSwatchColorProperty(schemaKey: string): boolean {
  return SWATCH_COLOR_SCHEMA_KEYS.has(schemaKey)
}

/** The model's answer to the color-name stage: a swatch key or a free phrase. */
interface ColorNamePick {
  pick: "swatch" | "color"
  value: string
}

/** The model's answer to the css-match fallback stage. */
interface CssColorPick {
  pick: "css" | "none"
  value?: string
}

/** One swatch of the workspace theme, carried through the whole pipeline. */
export interface SwatchEntry {
  key: string
  /** Friendly name from the theme cell, when the cell carries one. */
  displayName?: string
  /** Rendered color as a CSS string, when the cell resolves to one. */
  cssColor?: string
}

/**
 * Swatches of the workspace's first computed theme. Theme computation can
 * throw on a malformed workspace; an empty list degrades the pipeline to
 * name-and-literal resolution rather than failing the turn.
 */
export function workspaceSwatchEntries(workspace: Workspace): SwatchEntry[] {
  try {
    const firstComputedTheme = computeWorkspaceThemes(workspace)[0]
    if (!firstComputedTheme) return []
    return Object.entries(firstComputedTheme.swatch).flatMap(([key, cell]) => {
      if (!isSwatchToken(cell)) return []
      return [
        {
          key,
          displayName: cell.name,
          cssColor: themeSwatchToCssBackground(cell),
        },
      ]
    })
  } catch {
    return []
  }
}

/** Renders a swatch as the prompt line the model sees, e.g.
 * `swatch4 (Tint 4, hsl(30, 40%, 50%))`. The rendered color is what lets the
 * model match "black" to a swatch that IS black without guessing. */
function swatchChoice(entry: SwatchEntry): ColorSwatchChoice {
  const nameDiffersFromKey =
    entry.displayName !== undefined &&
    normalizeForNameMatch(entry.displayName) !== normalizeForNameMatch(entry.key)
  const detailParts = [
    ...(nameDiffersFromKey ? [entry.displayName!] : []),
    ...(entry.cssColor ? [entry.cssColor] : []),
  ]
  const label =
    detailParts.length > 0
      ? `${entry.key} (${detailParts.join(", ")})`
      : entry.key
  return { key: entry.key, label }
}

/** Strips spaces and punctuation so "Tint 4" matches "tint4" but not "tint1". */
function normalizeForNameMatch(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9#(),.%]/g, "")
}

/** Outcome of the deterministic cascade over a color phrase. */
export type ColorPhraseMatch =
  | { kind: "matched"; value: unknown }
  | { kind: "unmatched" }

/**
 * Maps a color phrase to a storable value without a model call, in the same
 * preference order the editor offers: preset option, theme swatch, literal
 * color code, CSS named color. The swatch check runs here as well as in the
 * stage's enum branch because the model sometimes routes a swatch name
 * through the free-phrase branch. Option and literal values return loose --
 * the repair pass (normalize-actions) tags them; swatch references return
 * tagged because their tag carries the property's theme scope.
 */
export function matchColorPhrase(
  colorPhrase: string,
  swatches: SwatchEntry[],
  schemaKey: string,
): ColorPhraseMatch {
  const strippedPhrase = colorPhrase.trim().replace(/^["']+|["']+$/g, "")
  if (strippedPhrase === "") return { kind: "unmatched" }

  const presetMatch = getPresetOptions(schemaKey).find(
    (option) =>
      typeof option === "string" &&
      option.toLowerCase() === strippedPhrase.toLowerCase(),
  )
  if (presetMatch !== undefined) return { kind: "matched", value: presetMatch }

  const normalizedPhrase = normalizeForNameMatch(strippedPhrase)
  const swatchMatch = swatches.find(
    (swatch) =>
      normalizeForNameMatch(swatch.key) === normalizedPhrase ||
      (swatch.displayName !== undefined &&
        normalizeForNameMatch(swatch.displayName) === normalizedPhrase),
  )
  const swatchScopeTag = themeRefTag(schemaKey)
  if (swatchMatch && swatchScopeTag) {
    return {
      kind: "matched",
      value: { type: swatchScopeTag, value: `@swatch.${swatchMatch.key}` },
    }
  }

  const phraseIsColorLiteral = isValidColor(strippedPhrase)
  if (phraseIsColorLiteral) return { kind: "matched", value: strippedPhrase }

  const namedColorHex = cssColorHex(strippedPhrase)
  if (namedColorHex) return { kind: "matched", value: namedColorHex }

  return { kind: "unmatched" }
}

/**
 * Resolves a color property's value the way the terminus pipeline did: one
 * call names the color (swatch key or free phrase), a deterministic cascade
 * encodes it, and only a phrase outside the CSS color list costs a second,
 * enum-constrained call for the closest CSS name. The model never writes a
 * color code, so every committed value comes from the theme table or the CSS
 * color table -- an invalid color value is unrepresentable by construction.
 */
export async function resolveColorValue(
  context: TurnContext,
  propertyKey: string,
  schemaKey: string,
): Promise<PropertyValueResolution> {
  const swatches = workspaceSwatchEntries(context.state.workspace)

  const nameStage = buildResolveColorNameStage({
    propertyKey,
    message: context.message,
    swatches: swatches.map(swatchChoice),
  })
  const { value: namePick, metrics: nameMetrics } =
    await callOllamaFormat<ColorNamePick>({
      model: context.model,
      host: context.host,
      prompt: nameStage.prompt,
      schema: nameStage.schema,
    })
  context.calls.push(nameMetrics)
  recordStep(context, "resolve_color_name", {
    ok: true,
    prompt: nameStage.prompt,
    output: JSON.stringify(namePick, null, 2),
  })

  const swatchScopeTag = themeRefTag(schemaKey)
  const pickIsKnownSwatch =
    namePick.pick === "swatch" &&
    swatchScopeTag !== null &&
    swatches.some((swatch) => swatch.key === namePick.value)
  if (pickIsKnownSwatch) {
    return {
      kind: "resolved",
      value: { type: swatchScopeTag, value: `@swatch.${namePick.value}` },
    }
  }

  const colorPhrase = namePick.value
  const cascadeMatch = matchColorPhrase(colorPhrase, swatches, schemaKey)
  if (cascadeMatch.kind === "matched") {
    return { kind: "resolved", value: cascadeMatch.value }
  }

  const cssStage = buildMatchCssColorStage({
    colorPhrase,
    cssColorNames: CSS_COLOR_NAMES,
  })
  const { value: cssPick, metrics: cssMetrics } =
    await callOllamaFormat<CssColorPick>({
      model: context.model,
      host: context.host,
      prompt: cssStage.prompt,
      schema: cssStage.schema,
    })
  context.calls.push(cssMetrics)
  recordStep(context, "match_css_color", {
    ok: true,
    prompt: cssStage.prompt,
    output: JSON.stringify(cssPick, null, 2),
  })

  const matchedCssHex =
    cssPick.pick === "css" && cssPick.value !== undefined
      ? cssColorHex(cssPick.value)
      : undefined
  if (matchedCssHex) return { kind: "resolved", value: matchedCssHex }

  const swatchHint =
    swatches.length > 0
      ? ` or a theme swatch (${swatches.map((swatch) => swatch.key).join(", ")})`
      : ""
  return {
    kind: "message",
    text: `I couldn't turn "${colorPhrase}" into a color for ${propertyKey}. Name a color like "red", give a code like #e53935${swatchHint}, then ask again.`,
  }
}
