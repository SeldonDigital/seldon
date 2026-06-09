import {
  isLayeredPaintRoot,
  layeredFacetPath,
} from "@lib/properties/property-paths"
import type { LayeredPaintKey } from "@seldon/core/properties/types/property-keys"

/**
 * Resolves the preset sub-property key for a compound or layered-paint property.
 * Layered paints address their preset facet through the layer-0 path; other
 * compounds use the plain `${key}.preset` form.
 */
export function compoundPresetPropertyKey(propertyKey: string): string {
  if (isLayeredPaintRoot(propertyKey)) {
    return layeredFacetPath(propertyKey as LayeredPaintKey, "preset")
  }
  return `${propertyKey}.preset`
}

/**
 * Strips the `type`/`value` envelope keys and empty facets from a compound
 * value, leaving only the populated sub-properties for a partial update.
 */
export function cleanCompoundValue(
  compoundValue: unknown,
): Record<string, unknown> {
  const current = compoundValue || {}
  return Object.keys(current).reduce(
    (acc, key) => {
      if (
        key !== "type" &&
        key !== "value" &&
        (current as Record<string, unknown>)[key]
      ) {
        acc[key] = (current as Record<string, unknown>)[key]
      }
      return acc
    },
    {} as Record<string, unknown>,
  )
}
