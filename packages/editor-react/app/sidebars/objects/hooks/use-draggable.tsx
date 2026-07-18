import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source"
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview"
import { useEffect, useRef, useState } from "react"
import { Instance, Variant } from "@seldon/core"

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
      onGenerateDragPreview: ({ nativeSetDragImage, location }) => {
        // The drag image is the row's combobox-field only, which drops the
        // leading disclosure arrow and keeps the icon, label, and selected
        // border exactly as they sit in the sidebar. Detached from the layout,
        // the field has no surface, so pin its width and paint the sidebar
        // background. `preserveOffsetOnSource` keeps the image under the cursor
        // at the exact point the row was grabbed.
        const field =
          (el.querySelector(".sdn-combobox-field") as HTMLElement | null) ?? el
        const width = field.getBoundingClientRect().width
        setCustomNativeDragPreview({
          getOffset: preserveOffsetOnSource({
            element: field,
            input: location.current.input,
          }),
          render: ({ container }) => {
            const clone = field.cloneNode(true) as HTMLElement
            clone.style.width = `${width}px`
            clone.style.margin = "0"
            clone.style.backgroundColor = "var(--sdn-swatch-offWhite)"
            clone
              .querySelectorAll('[data-dragging="true"]')
              .forEach((node) => node.removeAttribute("data-dragging"))
            container.appendChild(clone)
            return () => clone.remove()
          },
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
