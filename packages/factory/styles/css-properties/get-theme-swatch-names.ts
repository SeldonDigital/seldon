import { getDynamicSwatchName } from "@seldon/core/themes/compute"
import { Theme } from "@seldon/core/themes/types"

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
 * generated theme stylesheet (for example `background`, `primary`, `accent1`).
 */
export function getThemeSwatchVarNames(theme: Theme): Record<string, string> {
  const swatchNames: Record<string, string> = {}

  Object.entries(theme.swatch).forEach(([key, value]) => {
    if (!value) return
    if (key.startsWith("custom") && value.name) {
      swatchNames[key] = slugify(value.name)
    } else if (
      key === "swatch1" ||
      key === "swatch2" ||
      key === "swatch3" ||
      key === "swatch4"
    ) {
      swatchNames[key] = slugify(
        getDynamicSwatchName(
          key as "swatch1" | "swatch2" | "swatch3" | "swatch4",
          theme,
        ),
      )
    } else {
      swatchNames[key] = key
    }
  })

  return ensureUniqueSwatchNames(swatchNames)
}

/**
 * Returns a `var(--sdn-...swatch-*)` reference for a `@swatch.*` theme key, or
 * undefined when the key does not name a swatch in the theme.
 */
export function getThemeSwatchVarReference(
  swatchKey: string,
  theme: Theme,
  themeSlug?: string,
): string | undefined {
  if (!swatchKey.startsWith("@swatch.")) return undefined
  const id = swatchKey.slice("@swatch.".length)
  if (!theme.swatch || !theme.swatch[id as keyof typeof theme.swatch]) {
    return undefined
  }

  const name = getThemeSwatchVarNames(theme)[id]
  if (!name) return undefined

  const slug = themeSlug || (theme.id as string) || "default"
  const prefix = slug === "default" ? "--sdn-" : `--sdn-${slug}-`
  return `var(${prefix}swatch-${name})`
}
