import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview"
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview"
import { useEffect, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import { LayeredPaintKey } from "@seldon/core"
import { IconProps } from "@seldon/components/primitives/Icon"
import { DragNodePreview } from "@app/sidebars/DragNodePreview"

export const LAYER_DRAG_ACTION = "properties-reorder-layer"

/**
 * Makes a layered paint parent row (`background`/`shadow`) a drag source for
 * reordering its stack. Carries the property root and the dragged layer index,
 * and renders the same pill preview used by the objects sidebar.
 */
export function useLayerDraggable({
  property,
  layerIndex,
  label,
  icon,
}: {
  property: LayeredPaintKey
  layerIndex: number
  label: string
  icon: string
}) {
  const [dragging, setDragging] = useState(false)
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
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        setCustomNativeDragPreview({
          getOffset: pointerOutsideOfPreview({ x: "16px", y: "8px" }),
          render: ({ container }) => {
            const root = createRoot(container)
            root.render(
              <DragNodePreview
                label={label}
                icon={icon as IconProps["icon"]}
              />,
            )
            return () => root.unmount()
          },
          nativeSetDragImage,
        })
      },
    })
  }, [property, layerIndex, label, icon])

  return { ref, dragging }
}
