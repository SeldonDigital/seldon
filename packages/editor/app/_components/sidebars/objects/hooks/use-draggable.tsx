import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { pointerOutsideOfPreview } from "@atlaskit/pragmatic-drag-and-drop/element/pointer-outside-of-preview"
import { setCustomNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview"
import { useEffect, useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import { Board, Instance, Variant } from "@seldon/core"
import { isBoard } from "@seldon/core/workspace/helpers/is-board"
import { ListItemTree } from "../../../../seldon/elements/ListItemTree"
import { IconProps } from "../../../../seldon/primitives/Icon"
import { useNodeIcon } from "./use-node-icon"

/**
 * Makes an element draggable for drag-and-drop operations in the objects sidebar.
 * Handles both board reordering and node movement with custom drag preview.
 *
 * @param enable - Whether drag-and-drop is enabled (default: true)
 * @param target - The board, variant, or instance to make draggable
 * @param onDragStart - Optional callback when drag starts (e.g., collapse node)
 * @returns Object with ref to attach to element and dragging state
 */
export function useDraggable({
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
        if (isBoardTarget) {
          return {
            subjectBoard: target,
            action: "object-panel-reorder-board",
          }
        }

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

/**
 * Preview component shown during drag operations.
 * Displays a simplified version of the node being dragged.
 */
function Preview({ node }: { node: Variant | Instance | Board }) {
  const icon = useNodeIcon(node)

  return (
    <ListItemTree
      icon={{ icon: icon as IconProps["icon"] }}
      label={{ children: node.label }}
      button={{ style: { display: "none" } }}
      button2={{ style: { display: "none" } }}
      button3={{ style: { display: "none" } }}
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        color: "white",
        padding: "0.5rem",
        borderRadius: "4px",
        minWidth: "200px",
      }}
    />
  )
}
