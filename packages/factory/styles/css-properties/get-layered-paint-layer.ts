import type { Properties } from "@seldon/core"
import type { LayeredPaintKey } from "@seldon/core/properties/types/property-keys"

const LAYER_INDEX = 0

/**
 * Reads the top layer (index 0) of a layered paint stack, or a legacy single-object shape.
 */
export function getLayeredPaintLayer(
  properties: Properties,
  key: LayeredPaintKey,
): Record<string, unknown> | undefined {
  const stack = properties[key] as unknown
  if (!stack) return undefined

  if (Array.isArray(stack)) {
    const layer = stack[LAYER_INDEX]
    if (layer && typeof layer === "object" && !Array.isArray(layer)) {
      return layer as Record<string, unknown>
    }
    return undefined
  }

  if (typeof stack === "object") {
    return stack as Record<string, unknown>
  }

  return undefined
}
