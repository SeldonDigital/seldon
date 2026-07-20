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
}

/**
 * Updates a property with a new value
 */
export function updateProperty({
  property,
  value,
  setProperties,
}: UpdatePropertyOptions): void {
  if (property.isSubProperty) {
    const parsed = parsePropertyPath(property.key)
    if (parsed.kind === "layered-facet") {
      // Pad lower slots with empty bags so the slot-merge writes only this layer.
      const layers = Array.from({ length: parsed.index + 1 }, (_, i) =>
        i === parsed.index ? { [parsed.facet]: value } : {},
      )
      setProperties(
        {
          [parsed.root]: layers,
        } as Properties,
        { mergeSubProperties: true },
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
