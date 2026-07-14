import { isCompoundCatalogProperty } from "../../constants/shared/compound-properties"
import { isShorthandCatalogProperty } from "../../constants/shared/shorthand-properties"
import { LAYERED_PAINT_KEYS } from "../../types/property-keys"
import { PROPERTY_SCHEMAS } from "../data/property-schemas"

const LAYERED_PAINT_ROOTS: ReadonlySet<string> = LAYERED_PAINT_KEYS

/** Flattens a compound facet to its catalog key, e.g. `border` + `color` -> `borderColor`. */
export function joinCompoundFacetKey(parent: string, facet: string): string {
  return `${parent}${facet.charAt(0).toUpperCase()}${facet.slice(1)}`
}

/**
 * Resolves a node property path (dot-separated, including layered paint indices) to a flattened
 * {@link PROPERTY_SCHEMAS} map key when one exists.
 */
export function getCatalogKeyForPropertyPath(path: string): string | undefined {
  if (path in PROPERTY_SCHEMAS) return path

  const segments = path.split(".").filter(Boolean)
  if (segments.length < 2) return undefined

  const root = segments[0]!

  if (LAYERED_PAINT_ROOTS.has(root) && segments.length >= 3) {
    const maybeIndex = segments[1]!
    if (!/^\d+$/.test(maybeIndex)) return undefined
    const facet = segments[2]!
    const joined = joinCompoundFacetKey(root, facet)
    if (joined in PROPERTY_SCHEMAS) return joined
    if (facet in PROPERTY_SCHEMAS) return facet
    return undefined
  }

  // Only layered paint paths (handled above) have more than two segments. Any
  // other long path is a theme look or token key (e.g. `font.display.style`,
  // `border.singlePixel.width`), not a node property path. Stop here so a look
  // id that happens to match a property name does not borrow its icon.
  if (segments.length > 2) return undefined

  // Shorthand node paths are always two segments (`margin.top`).
  if (isShorthandCatalogProperty(root) && root in PROPERTY_SCHEMAS) {
    return root
  }

  if (isCompoundCatalogProperty(root)) {
    const facet = segments[1]!
    const joined = joinCompoundFacetKey(root, facet)
    if (joined in PROPERTY_SCHEMAS) return joined
    if (facet in PROPERTY_SCHEMAS) return facet
    return undefined
  }

  const last = segments[segments.length - 1]!
  if (last in PROPERTY_SCHEMAS) return last

  return undefined
}
