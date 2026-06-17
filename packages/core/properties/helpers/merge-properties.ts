import { ValueType } from "../constants"
import type { Properties } from "../types/properties"
import {
  LAYERED_PAINT_KEYS,
  type LayeredPaintKey,
  OBJECT_FACET_PROPERTY_KEYS,
  type ObjectFacetPropertyKey,
} from "../types/property-keys"
import { mergeTaggedValues } from "./merge-tagged-value"

/** Aligns two paint stacks by index and merges plain layer objects when asked. */
function mergeLayerArrays<T extends Record<string, unknown>>(
  base: T[],
  next: T[],
  mergeSubProperties: boolean,
): T[] {
  if (!mergeSubProperties) return next
  const len = Math.max(base.length, next.length)
  return Array.from({ length: len }, (_, i) => {
    const a = base[i]
    const b = next[i]
    if (b === undefined) return a as T
    if (a === undefined) return b as T
    if (
      a &&
      typeof a === "object" &&
      !("type" in a) &&
      b &&
      typeof b === "object" &&
      !("type" in b)
    ) {
      return { ...a, ...b } as T
    }
    return b as T
  })
}

/**
 * Writes `properties2` onto `properties1` and returns the combined snapshot.
 * When `mergeSubProperties` is true, nested facet maps merge field by field.
 * Paint arrays merge by slot for background, gradient, and shadow.
 * Empty patch values are skipped so the base value or catalog default can show through.
 */
export function mergeProperties(
  properties1: Properties = {},
  properties2: Properties = {},
  options?: {
    mergeSubProperties?: boolean
  },
): Properties {
  const keys = Object.keys(properties2) as Array<keyof Properties>

  const { mergeSubProperties = true } = options ?? {}

  return keys.reduce((merged, key) => {
    let value: unknown

    if (key in properties1) {
      if (mergeSubProperties) {
        const existingValue = properties1[key]
        const newValue = properties2[key]

        if (
          LAYERED_PAINT_KEYS.has(key as LayeredPaintKey) &&
          Array.isArray(existingValue) &&
          Array.isArray(newValue)
        ) {
          value = mergeLayerArrays(
            existingValue as Record<string, unknown>[],
            newValue as Record<string, unknown>[],
            mergeSubProperties,
          )
        } else if (LAYERED_PAINT_KEYS.has(key as LayeredPaintKey)) {
          value = newValue
        } else if (
          OBJECT_FACET_PROPERTY_KEYS.has(key as ObjectFacetPropertyKey) &&
          existingValue &&
          typeof existingValue === "object" &&
          !Array.isArray(existingValue) &&
          !("type" in existingValue) &&
          newValue &&
          typeof newValue === "object" &&
          !Array.isArray(newValue) &&
          !("type" in newValue)
        ) {
          value = { ...existingValue, ...newValue }
        } else {
          value = mergeTaggedValues(existingValue, newValue)
        }
      } else {
        value = properties2[key]
      }
    } else {
      value = properties2[key]
    }

    if (
      value &&
      typeof value === "object" &&
      "type" in value &&
      value.type === ValueType.EMPTY
    ) {
      return merged
    }

    return {
      ...merged,
      [key]: value,
    }
  }, properties1)
}
