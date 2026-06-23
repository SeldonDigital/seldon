import { ValueType } from "../constants"
import type {
  LayeredPaintKey,
  PropertyKey,
  SubPropertyKey,
} from "../types/property-keys"
import type { Value } from "../types/value"
import type { ComputedValue } from "../values/shared/computed/computed-value"
import { applyMatchColorMirror } from "./compute-match-mirror"
import type { ComputeContext, ComputeKeys } from "./types"

/** Same routing as `compute-properties` for one `COMPUTED` payload (injected to avoid import cycles). */
export type DispatchComputedFn = (
  value: ComputedValue,
  context: ComputeContext,
  keys: ComputeKeys,
) => Value

/**
 * Walks `background` / `shadow` stacks like `merge-properties`: one result slot per
 * layer, preserving array order and shape. Resolves `COMPUTED` facets on each layer object via
 * `dispatchComputed`; other facet values are copied through.
 */
export function computeLayeredPaintStack(
  propertyKey: LayeredPaintKey,
  layers: unknown[],
  context: ComputeContext,
  dispatchComputed: DispatchComputedFn,
): unknown[] {
  return layers.map((layer) => {
    if (!layer || typeof layer !== "object" || Array.isArray(layer)) {
      return layer
    }

    const layerRecord = layer as Record<string, unknown>
    const out: Record<string, Value> = {}

    for (const [facetKey, facetValue] of Object.entries(layerRecord)) {
      if (
        facetValue &&
        typeof facetValue === "object" &&
        "type" in facetValue &&
        (facetValue as { type: unknown }).type === ValueType.COMPUTED
      ) {
        out[facetKey] = dispatchComputed(facetValue as ComputedValue, context, {
          propertyKey: propertyKey as PropertyKey,
          subPropertyKey: facetKey as SubPropertyKey,
        })
      } else {
        out[facetKey] = facetValue as Value
      }
    }

    applyMatchColorMirror(layerRecord, out, context)

    return out
  })
}
