import type { Properties } from "@seldon/core"
import type { BackgroundLayer } from "@seldon/core/properties/values/appearance/background"
import type { ShadowCompound } from "@seldon/core/properties/values/effects/shadow"

type LayeredPaintLayerMap = {
  background: BackgroundLayer
  shadow: ShadowCompound
}

/**
 * Reads every layer of a layered paint stack as a typed array. Index 0 is the
 * bottom layer. A legacy single-object shape is normalized to a one-item list.
 */
export function getLayeredPaintLayers<K extends keyof LayeredPaintLayerMap>(
  properties: Properties,
  key: K,
): LayeredPaintLayerMap[K][] {
  const stack = properties[key] as unknown
  if (!stack) return []

  if (Array.isArray(stack)) {
    return stack.filter(
      (layer): layer is LayeredPaintLayerMap[K] =>
        !!layer && typeof layer === "object" && !Array.isArray(layer),
    )
  }

  if (typeof stack === "object") {
    return [stack as LayeredPaintLayerMap[K]]
  }

  return []
}
