import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { useEffect, useRef, useState } from "react"
import { LayeredPaintKey, invariant } from "@seldon/core"
import type { LayerPlacement } from "@seldon/editor/lib/properties/layer-reorder"
import { LAYER_DRAG_ACTION } from "./use-layer-draggable"

/**
 * Makes a band of a layered paint parent row a drop target for layer reordering.
 * Only accepts a drag from the same property root, so background layers cannot
 * drop onto shadow rows and vice versa.
 */
export function useLayerDropzone({
  property,
  layerIndex,
  layerCount,
  placement,
}: {
  property: LayeredPaintKey
  layerIndex: number
  layerCount: number
  placement: LayerPlacement
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [isValidDropTarget, setValidDropTarget] = useState(false)

  useEffect(() => {
    const el = ref.current
    invariant(el, "Element ref is not set")

    const accepts = (sourceData: Record<string, unknown>) =>
      sourceData.action === LAYER_DRAG_ACTION &&
      sourceData.property === property &&
      sourceData.layerIndex !== layerIndex

    return dropTargetForElements({
      element: el,
      getData: () => ({
        action: LAYER_DRAG_ACTION,
        property,
        targetLayerIndex: layerIndex,
        layerCount,
        placement,
      }),
      canDrop: ({ source }) => accepts(source.data),
      onDragEnter: ({ source }) => setValidDropTarget(accepts(source.data)),
      onDragLeave: () => setValidDropTarget(false),
      onDrop: () => setValidDropTarget(false),
    })
  }, [property, layerIndex, layerCount, placement])

  return { ref, isValidDropTarget }
}
