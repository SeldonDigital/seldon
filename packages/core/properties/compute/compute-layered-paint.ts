import { isComputedValue } from "../../helpers/type-guards/value/is-computed-value"
import { isInheritValue } from "../../helpers/type-guards/value/is-inherit-value"
import { applyMatchColorMirror } from "./compute-match-color-mirror"
import { inheritPaintLayer, resolveInheritSource } from "./resolve-inherit"

import type { LayeredPaintKey, PropertyKey, SubPropertyKey } from "../types/property-keys"
import type { Value } from "../types/value"
import type { ComputedValue } from "../values/shared/computed/computed-value"
import type { ComputeContext, ComputeKeys } from "./types"

/** Same routing as `compute-properties` for one `COMPUTED` payload (injected to avoid import cycles). */
export type DispatchComputedFn = (
  value: ComputedValue,
  context: ComputeContext,
  keys: ComputeKeys,
) => Value

/**
 * Walks `background` / `shadow` stacks like `merge-properties`: one result slot per
 * layer, preserving array order and shape. An `INHERIT` layer preset copies the parent
 * layer first. Resolves `COMPUTED` and `INHERIT` facets on each layer object.
 */
export function computeLayeredPaintStack(
  propertyKey: LayeredPaintKey,
  layers: unknown[],
  context: ComputeContext,
  dispatchComputed: DispatchComputedFn,
): unknown[] {
  return layers.map((layer, index) => {
    if (!layer || typeof layer !== "object" || Array.isArray(layer)) {
      return layer
    }

    const authored = layer as Record<string, Value>
    const layerRecord = isInheritValue(authored.preset)
      ? inheritPaintLayer(propertyKey, index, authored, context)
      : authored
    const out: Record<string, Value> = {}

    for (const [facetKey, facetValue] of Object.entries(layerRecord)) {
      const keys: ComputeKeys = {
        propertyKey: propertyKey as PropertyKey,
        subPropertyKey: facetKey as SubPropertyKey,
      }

      if (isInheritValue(facetValue)) {
        const inherited = resolveInheritSource(`${propertyKey}.${index}.${facetKey}`, context)

        if (!inherited) {
          out[facetKey] = facetValue
        } else if (isComputedValue(inherited.value)) {
          out[facetKey] = dispatchComputed(inherited.value, inherited.source, keys)
        } else {
          out[facetKey] = inherited.value
        }
      } else if (isComputedValue(facetValue)) {
        out[facetKey] = dispatchComputed(facetValue, context, keys)
      } else {
        out[facetKey] = facetValue
      }
    }

    applyMatchColorMirror(layerRecord, out, context)

    return out
  })
}
