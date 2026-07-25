/**
 * Handles property value updates (non-computed values)
 */
import { parsePropertyPath } from "@seldon/editor/lib/properties/property-paths"
import {
  getSubPropertyKeys,
  isShorthandProperty,
} from "@seldon/editor/lib/properties/property-types"
import { Properties, Value } from "@seldon/core"
import { FlatProperty } from "./properties-data"

interface UpdatePropertyOptions {
  property: FlatProperty
  value: Value
  setProperties: (
    properties: Record<string, unknown>,
    options?: { mergeSubProperties?: boolean },
  ) => void
  /**
   * The node's current effective layered stack for the edited paint property.
   * A layered facet edit materializes this whole stack and sets the one facet,
   * so the node takes ownership of the layer count and order.
   */
  effectiveLayers?: Record<string, unknown>[]
}

/**
 * Updates a property with a new value
 */
export function updateProperty({
  property,
  value,
  setProperties,
  effectiveLayers,
}: UpdatePropertyOptions): void {
  if (property.isSubProperty) {
    const parsed = parsePropertyPath(property.key)
    if (parsed.kind === "layered-facet") {
      // Materialize the whole effective stack and set just this facet, so the
      // node owns the layer count and order and the edit never truncates or
      // reorders sibling layers. Falls back to a padded array when no effective
      // stack is available.
      const base =
        effectiveLayers && effectiveLayers.length > parsed.index
          ? effectiveLayers.map((layer) =>
              layer && typeof layer === "object" && !Array.isArray(layer)
                ? { ...layer }
                : {},
            )
          : Array.from(
              { length: parsed.index + 1 },
              () => ({}) as Record<string, unknown>,
            )
      base[parsed.index] = {
        ...base[parsed.index],
        [parsed.facet]: value,
      }
      setProperties(
        {
          [parsed.root]: base,
        } as Properties,
        { mergeSubProperties: false },
      )
      return
    }
    if (parsed.kind === "facet") {
      setProperties(
        {
          [parsed.root]: {
            [parsed.facet]: value,
          },
        },
        { mergeSubProperties: true },
      )
      return
    }
  } else {
    if (isShorthandProperty(property.key)) {
      const subPropertyKeys = getSubPropertyKeys(property.key)
      const compoundProperty: Record<string, unknown> = {}
      subPropertyKeys.forEach((subKey) => {
        compoundProperty[subKey] = value
      })
      setProperties(
        { [property.key]: compoundProperty },
        { mergeSubProperties: false },
      )
    } else {
      setProperties({
        [property.key]: value,
      })
    }
  }
}
