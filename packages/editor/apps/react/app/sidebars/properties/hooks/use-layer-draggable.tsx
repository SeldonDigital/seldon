import { setRowDragPreview } from "@app/sidebars/row-drag-preview"
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { useEffect, useRef } from "react"

import type { LayeredPaintKey } from "@seldon/core"

export const LAYER_DRAG_ACTION = "properties-reorder-layer"

/**
 * Makes a layered paint parent row (`background`/`shadow`) a drag source for
 * reordering its stack. Carries the property root and the dragged layer index,
 * and shows the row itself as the drag image, the same way the objects sidebar
 * does.
 */
export function useLayerDraggable({
  property,
  layerIndex,
}: {
  property: LayeredPaintKey
  layerIndex: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current

    if (!el) return

    return draggable({
      element: el,
      getInitialData: () => ({
        action: LAYER_DRAG_ACTION,
        property,
        layerIndex,
      }),
      onGenerateDragPreview: ({ nativeSetDragImage, location }) => {
        // The row root, so the image keeps the label, value, and row chrome as
        // they sit in the sidebar. The drag source wrapper also holds the drop
        // bands, which have no place in the image.
        const row = (el.querySelector(".sdn-item-property") as HTMLElement | null) ?? el

        setRowDragPreview({
          element: row,
          input: location.current.input,
          nativeSetDragImage,
        })
      },
    })
  }, [property, layerIndex])

  return { ref }
}
