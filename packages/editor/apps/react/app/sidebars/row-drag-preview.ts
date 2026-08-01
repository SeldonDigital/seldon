import { preserveOffsetOnSource } from "@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source"
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview"

import type { Input } from "@atlaskit/pragmatic-drag-and-drop/types"

interface RowDragPreviewOptions {
  element: HTMLElement
  input: Input
  nativeSetDragImage: DataTransfer["setDragImage"] | null
}

/**
 * Uses a clone of a sidebar row as the native drag image, so a drag reads as the
 * row itself lifted off the list. Detached from the layout the clone has no
 * surface, so its width is pinned and the sidebar background painted.
 * `preserveOffsetOnSource` holds it under the cursor at the exact point the row
 * was grabbed. Shared by the objects and properties sidebars so both drags look
 * the same.
 */
export function setRowDragPreview({
  element,
  input,
  nativeSetDragImage,
}: RowDragPreviewOptions): void {
  const width = element.getBoundingClientRect().width

  setCustomNativeDragPreview({
    getOffset: preserveOffsetOnSource({
      element,
      input,
    }),
    render: ({ container }) => {
      const clone = element.cloneNode(true) as HTMLElement

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
}
