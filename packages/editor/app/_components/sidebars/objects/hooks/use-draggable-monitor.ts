import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { Placement } from "@lib/types"
import { useEffect } from "react"
import { Board, Instance, Variant, invariant } from "@seldon/core"
import { useMoveObjects } from "@lib/workspace/use-move-objects"
import { useWorkspace } from "@lib/workspace/use-workspace"

/**
 * Global monitor for drag-and-drop operations in the objects sidebar.
 * Listens for board reordering and node movement events, applies preview changes,
 * and commits or rolls back workspace operations on drop.
 *
 * Uses preview sessions to show changes before committing, allowing rollback on errors.
 */
export function useDraggableMonitor() {
  const { moveNodeNextTo, moveBoardNextTo, moveNodeInside } = useMoveObjects()
  const { startPreviewSession, commitPreview, rollbackPreview } = useWorkspace()

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) =>
        source.data.action === "object-panel-move-node" ||
        source.data.action === "object-panel-reorder-board",

      onDragStart: () => {
        startPreviewSession()
      },

      onDrop() {
        try {
          commitPreview()
        } catch (error) {
          rollbackPreview()
          throw error
        }
      },
      onDropTargetChange({ source, location }) {
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
              isPreview: true,
            })
            break
          }
          case "object-panel-move-node": {
            const targetNode = destination.data.targetNode as Variant | Instance
            const placement = destination.data.placement as Placement
            const subjectNode = source.data.subjectNode as Variant | Instance

            invariant(targetNode, "targetNode was not set")
            invariant(placement, "placement was not set")
            invariant(subjectNode, "subjectNode was not set")

            if (placement === "inside") {
              moveNodeInside({
                targetNode,
                subjectNode,
                isPreview: true,
              })
            } else {
              moveNodeNextTo({
                targetNode,
                subjectNode,
                position: placement,
                isPreview: true,
              })
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
    startPreviewSession,
    commitPreview,
    rollbackPreview,
  ])
}
