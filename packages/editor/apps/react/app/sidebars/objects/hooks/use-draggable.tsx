import { setRowDragPreview } from "@app/sidebars/row-drag-preview"
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { useEffect, useRef, useState } from "react"

import type { Instance, Variant } from "@seldon/core"

export const MOVE_NODE_ACTION = "object-panel-move-node"

/**
 * Makes an element draggable for drag-and-drop operations in the objects sidebar.
 * Handles node movement with a custom drag preview.
 */
export function useDraggable({
  enable = true,
  target,
  onDragStart,
}: {
  target: Variant | Instance
  enable?: boolean
  onDragStart?: () => void
}) {
  const [dragging, setDragging] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current

    if (!el || !enable) return

    return draggable({
      element: el,
      getInitialData: () => ({
        subjectNode: target,
        action: MOVE_NODE_ACTION,
      }),
      onDragStart: () => {
        onDragStart?.()
        setDragging(true)
      },
      onDrop: () => setDragging(false),
      onGenerateDragPreview: ({ nativeSetDragImage, location }) => {
        // The drag image is the row's combobox-field only, which drops the
        // leading disclosure arrow and keeps the icon, label, and selected
        // border exactly as they sit in the sidebar.
        const field = (el.querySelector(".sdn-combobox-field") as HTMLElement | null) ?? el

        setRowDragPreview({
          element: field,
          input: location.current.input,
          nativeSetDragImage,
        })
      },
    })
  }, [target, enable, onDragStart])

  return {
    ref,
    dragging,
  }
}
