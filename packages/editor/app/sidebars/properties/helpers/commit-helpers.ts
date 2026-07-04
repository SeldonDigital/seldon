import {
  isLayeredPaintRoot,
  layeredFacetPath,
  parsePropertyPath,
} from "@lib/properties/property-paths"
import type {
  LayeredPaintKey,
  PropertyKey,
  SubPropertyKey,
} from "@seldon/core/properties/types/property-keys"

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
 * Routes a row reset to the right `resetProperty` dispatch shape: layered
 * facets and layered parents address their layer slot, plain facets address
 * the parent compound, and everything else resets the key directly.
 */
export function dispatchPropertyReset(
  propertyKey: string,
  isSubProperty: boolean,
  resetProperty: (
    propertyKey: PropertyKey,
    subpropertyKey?: SubPropertyKey,
    layerIndex?: number,
  ) => void,
): void {
  const parsed = parsePropertyPath(propertyKey)
  if (isSubProperty) {
    if (parsed.kind === "layered-facet") {
      resetProperty(
        parsed.root as PropertyKey,
        parsed.facet as SubPropertyKey,
        parsed.index,
      )
    } else if (parsed.kind === "facet") {
      resetProperty(parsed.root as PropertyKey, parsed.facet as SubPropertyKey)
    } else {
      resetProperty(propertyKey as PropertyKey)
    }
    return
  }
  if (parsed.kind === "layered-parent") {
    resetProperty(parsed.root as PropertyKey, undefined, parsed.index)
  } else {
    resetProperty(propertyKey as PropertyKey)
  }
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
