import { Theme } from "@seldon/core/themes/types"
import {
  THEME_INTERFACE_SLOTS,
  THEME_PALETTE_SLOTS,
} from "@seldon/core/themes/values"

import { brightnessSuffix } from "../computed-variables/names"

/**
 * Reserved swatch slots that emit a stable `var(--sdn-...swatch-*)` reference.
 * Harmony and interface roles align across themes by slot id, so a reference
 * carries over when the active theme switches. Custom swatches are arbitrary per
 * theme, so callers fall back to the resolved literal for them.
 */
const REFERENCEABLE_SWATCH_SLOTS = new Set<string>([
  ...THEME_PALETTE_SLOTS,
  ...THEME_INTERFACE_SLOTS,
])

function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

/**
 * Disambiguates swatch display names that collide by appending an index, so
 * each swatch maps to a stable, unique CSS variable suffix.
 */
function ensureUniqueSwatchNames(
  swatchNames: Record<string, string>,
): Record<string, string> {
  const nameCount = new Map<string, number>()
  Object.values(swatchNames).forEach((name) => {
    nameCount.set(name, (nameCount.get(name) || 0) + 1)
  })

  const result: Record<string, string> = {}
  const nameInstanceCount = new Map<string, number>()
  Object.entries(swatchNames).forEach(([key, name]) => {
    if (nameCount.get(name)! > 1) {
      const instanceCount = (nameInstanceCount.get(name) || 0) + 1
      nameInstanceCount.set(name, instanceCount)
      result[key] = `${name}${instanceCount}`
    } else {
      result[key] = name
    }
  })

  return result
}

/**
 * Maps each swatch id in a theme to the CSS variable suffix used by the
 * generated theme stylesheet. Reserved harmony and interface slots (including
 * `swatch1`-`swatch4`) use their slot id so the name aligns across themes and a
 * reference swaps with the active theme. Custom swatches use their display name
 * for readability, since references fall back to a literal for them.
 */
export function getThemeSwatchVarNames(theme: Theme): Record<string, string> {
  const swatchNames: Record<string, string> = {}

  Object.entries(theme.swatch).forEach(([key, value]) => {
    if (!value) return
    if (key.startsWith("custom") && value.name) {
      swatchNames[key] = slugify(value.name)
    } else {
      swatchNames[key] = key
    }
  })

  return ensureUniqueSwatchNames(swatchNames)
}

/**
 * Returns a `var(--sdn-swatch-*)` reference for a `@swatch.*` theme key, or
 * undefined when the key does not name a reserved swatch in the theme. Every
 * theme file defines these variables under the same unprefixed names, scoped by
 * `[data-theme]`, so the reference swaps with the active theme.
 */
export function getThemeSwatchVarReference(
  swatchKey: string,
  theme: Theme,
): string | undefined {
  if (!swatchKey.startsWith("@swatch.")) return undefined
  const id = swatchKey.slice("@swatch.".length)
  if (!REFERENCEABLE_SWATCH_SLOTS.has(id)) return undefined
  if (!theme.swatch || !theme.swatch[id as keyof typeof theme.swatch]) {
    return undefined
  }

  const name = getThemeSwatchVarNames(theme)[id]
  if (!name) return undefined

  return `var(--sdn-swatch-${name})`
}

/**
 * Returns a `var(--sdn-swatch-*-b*)` reference for a `@swatch.*` key shifted by a
 * non-zero brightness, or undefined when the key is not a reserved swatch. The
 * referenced variable holds the concrete brightened color, published once per
 * `(slot, brightness)` pair by the theme stylesheet, so the reference stays a
 * real color and still swaps with the active theme.
 */
export function getBrightnessSwatchVarReference(
  swatchKey: string,
  theme: Theme,
  brightness: number,
): string | undefined {
  if (brightness === 0) return undefined
  if (!swatchKey.startsWith("@swatch.")) return undefined
  const id = swatchKey.slice("@swatch.".length)
  if (!REFERENCEABLE_SWATCH_SLOTS.has(id)) return undefined
  if (!theme.swatch || !theme.swatch[id as keyof typeof theme.swatch]) {
    return undefined
  }

  const name = getThemeSwatchVarNames(theme)[id]
  if (!name) return undefined

  return `var(--sdn-swatch-${name}-${brightnessSuffix(brightness)})`
}
