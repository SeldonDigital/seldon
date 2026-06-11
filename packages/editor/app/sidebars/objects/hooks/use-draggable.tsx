import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview"
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview"
import { useEffect, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import { Instance, Variant } from "@seldon/core"
import { DragNodePreview } from "@seldon/components/custom-components"
import { IconProps } from "@seldon/components/primitives/Icon"
import { useNodeIcon } from "./use-node-icon"

/**
 * Makes an element draggable for drag-and-drop operations in the objects sidebar.
 * Handles node movement with a custom drag preview.
 */
export function useDraggable({
  enable = true,
  target,
  onDragStart,
}: {
  enable?: boolean
  target: Variant | Instance
  onDragStart?: () => void
}) {
  const [dragging, setDragging] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)
  const icon = useNodeIcon(target)

  useEffect(() => {
    const el = ref.current

    if (!el || !enable) return

    return draggable({
      element: el,
      getInitialData: () => ({
        subjectNode: target,
        action: "object-panel-move-node",
      }),
      onDragStart: () => {
        onDragStart?.()
        setDragging(true)
      },
      onDrop: () => setDragging(false),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        setCustomNativeDragPreview({
          getOffset: pointerOutsideOfPreview({ x: "16px", y: "8px" }),
          render: ({ container }) => {
            const root = createRoot(container)

            root.render(
              <DragNodePreview
                label={target.label}
                icon={icon as IconProps["icon"]}
              />,
            )
            return () => root.unmount()
          },
          nativeSetDragImage,
        })
      },
    })
  }, [target, enable, onDragStart, icon])

  return {
    ref,
    dragging,
  }
}
