import { isLookSection } from "../../../themes/looks/look-facets"

/** Sections whose `.step` row writes to `parameters.step`. */
const MODULATION_STEP_SECTIONS = new Set([
  "size",
  "dimension",
  "margin",
  "padding",
  "gap",
  "fontSize",
  "lineHeight",
  "borderWidth",
  "corners",
  "blur",
  "spread",
])

/**
 * Maps a theme token schema key (e.g. `size.medium.step`, `swatch.custom1`,
 * `shadow.moderate.blur`) to the dot-path of the override subtree the row owns
 * in a theme entry's `overrides`. Swatch rows own the whole cell so a reset
 * never leaves partial `parameters` behind. Returns null for keys with no
 * override path.
 */
export function getThemeOverridePath(key: string): string | null {
  const [section, id, facet] = key.split(".")
  if (!section || !id) return null

  if (
    section === "core" ||
    section === "color" ||
    section === "fontFamily"
  ) {
    return key
  }
  if (section === "swatch") {
    return `swatch.${id}`
  }
  if (section === "fontWeight") {
    return `fontWeight.${id}.value`
  }
  if (facet === "step" && MODULATION_STEP_SECTIONS.has(section)) {
    return `${section}.${id}.parameters.step`
  }
  if (facet && isLookSection(section)) {
    return `${section}.${id}.parameters.${facet}`
  }
  return null
}

/** Reads the value at one dot-path in a plain overrides object, or undefined. */
export function getOverrideAtPath(
  target: Record<string, unknown>,
  path: string,
): unknown {
  const keys = path.split(".").filter(Boolean)
  let cur: unknown = target
  for (const key of keys) {
    if (cur == null || typeof cur !== "object" || Array.isArray(cur)) {
      return undefined
    }
    cur = (cur as Record<string, unknown>)[key]
  }
  return cur
}

/** Removes one dot-path key from a plain overrides object. */
export function deleteOverrideAtPath(
  target: Record<string, unknown>,
  path: string,
): void {
  const keys = path.split(".").filter(Boolean)
  if (keys.length === 0) return
  let cur: Record<string, unknown> = target
  for (let i = 0; i < keys.length - 1; i++) {
    const k = keys[i]!
    const next = cur[k]
    if (typeof next !== "object" || next === null || Array.isArray(next)) {
      return
    }
    cur = next as Record<string, unknown>
  }
  delete cur[keys[keys.length - 1]!]
}
