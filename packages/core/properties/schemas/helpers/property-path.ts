import { ValueType } from "../../constants"
import { isCompoundCatalogProperty } from "../../constants/shared/compound-properties"
import { isShorthandCatalogProperty } from "../../constants/shared/shorthand-properties"
import type { PropertyValueType } from "../../types/schema"
import { PROPERTY_SCHEMAS } from "../data/property-schemas"

const LAYERED_PAINT_ROOTS = new Set<string>(["background", "shadow"])

function joinCompoundFacetKey(parent: string, facet: string): string {
  return `${parent}${facet.charAt(0).toUpperCase()}${facet.slice(1)}`
}

/**
 * Maps wire {@link ValueType} strings on stored values to {@link PropertyValueType} for schema helpers.
 */
export function valueTypeWireToPropertyValueType(
  wire: string,
): PropertyValueType | undefined {
  switch (wire) {
    case ValueType.EMPTY:
      return "empty"
    case ValueType.INHERIT:
      return "inherit"
    case ValueType.EXACT:
      return "exact"
    case ValueType.OPTION:
      return "option"
    case ValueType.COMPUTED:
      return "computed"
    case ValueType.THEME_CATEGORICAL:
      return "themeCategorical"
    case ValueType.THEME_ORDINAL:
      return "themeOrdinal"
    default:
      return undefined
  }
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
