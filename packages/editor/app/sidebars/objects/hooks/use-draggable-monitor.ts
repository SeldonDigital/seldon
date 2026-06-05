import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { Placement } from "@lib/types"
import { useEffect } from "react"
import { Board, Instance, Variant, invariant } from "@seldon/core"
import { useMoveObjects } from "@lib/workspace/use-move-objects"

/**
 * Global monitor for drag-and-drop operations in the objects sidebar.
 * Listens for board reordering and node movement events and commits the
 * reorder once when the drag is released.
 *
 * The move is applied a single time on drop, computed from committed state,
 * so nothing changes while dragging beyond the local drop indicator.
 */
export function useDraggableMonitor() {
  const {
    moveNodeNextTo,
    moveBoardNextTo,
    moveNodeInside,
    duplicateNodeInside,
    duplicateNodeNextTo,
  } = useMoveObjects()

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) =>
        source.data.action === "object-panel-move-node" ||
        source.data.action === "object-panel-reorder-board",

      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0]
        const { action } = source.data

        if (!destination) return

        switch (action) {
          case "object-panel-reorder-board": {
            const targetBoard = destination.data.targetBoard as Board
            const subjectBoard = source.data.subjectBoard as Board
            const placement = destination.data.placement as Placement

            invariant(targetBoard, "targetBoard was not set")
            invariant(subjectBoard, "subjectBoard was not set")
            invariant(placement, "placement was not set")

            moveBoardNextTo({
              targetBoard,
              subjectBoard,
              position: placement,
              isPreview: false,
            })
            break
          }
          case "object-panel-move-node": {
            const targetNode = destination.data.targetNode as Variant | Instance
            const placement = destination.data.placement as Placement
            const subjectNode = source.data.subjectNode as Variant | Instance
            const duplicate = destination.data.duplicate === true

            invariant(targetNode, "targetNode was not set")
            invariant(placement, "placement was not set")
            invariant(subjectNode, "subjectNode was not set")

            if (placement === "inside") {
              if (duplicate) {
                duplicateNodeInside({
                  targetNode,
                  subjectNode,
                  isPreview: false,
                })
              } else {
                moveNodeInside({
                  targetNode,
                  subjectNode,
                  isPreview: false,
                })
              }
            } else {
              if (duplicate) {
                duplicateNodeNextTo({
                  targetNode,
                  subjectNode,
                  position: placement,
                  isPreview: false,
                })
              } else {
                moveNodeNextTo({
                  targetNode,
                  subjectNode,
                  position: placement,
                  isPreview: false,
                })
              }
            }
            break
          }
          default: {
            throw new Error(`Invalid action: ${action}`)
          }
        }
      },
    })
  }, [
    moveNodeNextTo,
    moveBoardNextTo,
    moveNodeInside,
    duplicateNodeInside,
    duplicateNodeNextTo,
  ])
}
