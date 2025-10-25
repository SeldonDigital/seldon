import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview"
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview"
import { useEffect, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import { Board, Instance, Variant } from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/is-board"
import { Item } from "../Item"
import { useNodeIcon } from "./use-node-icon"

/*
 * Drag and drop has 3 parts: draggable, dropzone and monitor
 * This is the hook for making an element draggable
 */
export function useDragAndDropDraggable({
  enable = true,
  target,
  onDragStart,
}: {
  enable?: boolean
  target: Variant | Instance | Board
  onDragStart?: () => void
}) {
  const [dragging, setDragging] = useState<boolean>(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current

    if (!el || !enable) return
    const isBoardTarget = isBoard(target)

    return draggable({
      element: el,
      getInitialData: () => {
        // Board
        if (isBoardTarget) {
          return {
            subjectBoard: target,
            action: "object-panel-reorder-board",
          }
        }

        // Node
        return {
          subjectNode: target,
          action: "object-panel-move-node",
        }
      },
      onDragStart: () => {
        onDragStart?.()
        setDragging(true)
      },
      onDrop: () => setDragging(false),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        // We set a custom preview because the default preview makes it
        // hard to see where the item is being dragged to
        setCustomNativeDragPreview({
          getOffset: pointerOutsideOfPreview({ x: "16px", y: "8px" }),
          render: ({ container }) => {
            const root = createRoot(container)

            root.render(<Preview node={target} />)
            return () => root.unmount()
          },
          nativeSetDragImage,
        })
      },
    })
  }, [target, enable, onDragStart])

  return {
    ref,
    dragging,
    setDragging,
  }
}

function Preview({ node }: { node: Variant | Instance | Board }) {
  const icon = useNodeIcon(node)

  return (
    <Item
      icon={icon}
      expandable={false}
      className="objects-sidebar-node" // TODO: Remove once states are working
    >
      {node.label}
    </Item>
  )
}
