import {
  THEME_INTERFACE_SLOTS,
  THEME_PALETTE_SLOTS,
} from "@seldon/core/themes/values"

/**
 * Swatch slots that align across themes by id, so a high-contrast variable keyed by one carries
 * over when the active theme switches. Custom swatches are arbitrary per theme, so a high-contrast
 * reference against them falls back to the baked literal.
 */
export const REFERENCEABLE_SWATCH_SLOTS = new Set<string>([
  ...THEME_PALETTE_SLOTS,
  ...THEME_INTERFACE_SLOTS,
])

/** Rhythm side an optical-padding facet uses; top and bottom share the vertical rhythm. */
export type RhythmSide = "left" | "right" | "vertical"

function kebab(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase()
}

/** Reads the slot id from a `@swatch.*` reference, or null when the string is not one. */
export function swatchIdFromRef(ref: string): string | null {
  return ref.startsWith("@swatch.") ? ref.slice("@swatch.".length) : null
}

/** Splits a theme ordinal such as `@fontSize.medium` into its scale and step key. */
export function parseThemeOrdinal(
  token: string,
): { scale: string; key: string } | null {
  const match = /^@([A-Za-z0-9]+)\.(.+)$/.exec(token)
  if (!match) return null
  return { scale: match[1]!, key: match[2]! }
}

/** Maps an optical-padding facet side to the rhythm it uses. */
export function rhythmSideForFacet(side: string | undefined): RhythmSide {
  if (side === "right") return "right"
  if (side === "top" || side === "bottom") return "vertical"
  return "left"
}

export function highContrastVarName(slot: string): string {
  return `--sdn-hc-on-${slot}`
}

export function autoFitVarName(scale: string, key: string): string {
  return `--sdn-cmp-auto-fit-${kebab(scale)}-${key}`
}

export function opticalPaddingVarName(side: RhythmSide, key: string): string {
  return `--sdn-cmp-optical-padding-${side}-${key}`
}
