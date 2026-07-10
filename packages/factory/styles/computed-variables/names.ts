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

/**
 * Suffix that keys a brightness-shifted color variant, e.g. `b25` for a +25%
 * tint and `bn20` for a -20% shade. A fractional percent keeps its digits with
 * the dot swapped for an underscore so the suffix stays a valid identifier.
 */
export function brightnessSuffix(brightness: number): string {
  const magnitude = Math.abs(brightness).toString().replace(".", "_")
  return brightness < 0 ? `bn${magnitude}` : `b${magnitude}`
}

export function highContrastVarName(slot: string): string {
  return `--sdn-hc-on-${slot}`
}

/**
 * High-contrast variable for a brightness-shifted surface swatch, e.g.
 * `--sdn-hc-on-primary-b25`. The pick is baked against the brightened color, so
 * a node reading a tinted or shaded background gets the correct foreground.
 */
export function highContrastBrightnessVarName(
  slot: string,
  brightness: number,
): string {
  return `--sdn-hc-on-${slot}-${brightnessSuffix(brightness)}`
}

export function autoFitVarName(scale: string, key: string): string {
  return `--sdn-cmp-auto-fit-${kebab(scale)}-${key}`
}

export function opticalPaddingVarName(side: RhythmSide, key: string): string {
  return `--sdn-cmp-optical-padding-${side}-${key}`
}
