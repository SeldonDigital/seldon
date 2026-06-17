import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { useEffect } from "react"
import { LayeredPaintKey } from "@seldon/core"
import { useObjectProperties } from "@lib/workspace/hooks/use-object-properties"
import { LAYER_DRAG_ACTION } from "./use-layer-draggable"
import { useLayerDragStateStore } from "./use-layer-drag-state"
import {
  computeLayerToIndex,
  type LayerPlacement,
} from "../helpers/layer-reorder"

/**
 * Global monitor for layer reorder drags in the properties sidebar. Tracks an
 * active-drag flag so drop bands only intercept pointer events mid-drag, and on
 * drop translates the display-order drop into an array move committed through
 * the core `reorder_node_layer` action.
 */
export function useLayerDragMonitor() {
  const { reorderNodeLayer } = useObjectProperties()
  const setIsLayerDragging = useLayerDragStateStore(
    (state) => state.setIsLayerDragging,
  )

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) => source.data.action === LAYER_DRAG_ACTION,
      onDragStart() {
        setIsLayerDragging(true)
      },
      onDrop({ source, location }) {
        setIsLayerDragging(false)
        const destination = location.current.dropTargets[0]
        if (!destination) return

        const sourceProperty = source.data.property as LayeredPaintKey
        const fromIndex = source.data.layerIndex as number
        const targetProperty = destination.data.property as LayeredPaintKey
        const targetIndex = destination.data.targetLayerIndex as number
        const placement = destination.data.placement as LayerPlacement
        const layerCount = destination.data.layerCount as number

        if (sourceProperty !== targetProperty) return

        const toIndex = computeLayerToIndex(
          layerCount,
          fromIndex,
          targetIndex,
          placement,
        )
        if (toIndex === fromIndex) return

        reorderNodeLayer(sourceProperty, fromIndex, toIndex)
      },
    })
  }, [reorderNodeLayer, setIsLayerDragging])
}
