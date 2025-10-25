import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { Placement } from "@lib/types"
import { useEffect } from "react"
import { Board, Instance, Variant, invariant } from "@seldon/core"
import { useMoveObjects } from "@lib/workspace/use-move-objects"
import { useWorkspace } from "@lib/workspace/use-workspace"

/*
 * Drag and drop has 3 parts: draggable, dropzone and monitor
 * This is the hook for monitoring and resolving drag and drop events
 */
export function useDragAndDropMonitor() {
  const { moveNodeNextTo, moveBoardNextTo, moveNodeInside } = useMoveObjects()
  const { startPreviewSession, commitPreview, rollbackPreview } = useWorkspace()

  useEffect(() => {
    return monitorForElements({
      canMonitor: ({ source }) =>
        source.data.action === "object-panel-move-node" ||
        source.data.action === "object-panel-reorder-board",

      onDragStart: () => {
        // Start a new preview session when drag begins
        startPreviewSession()
      },

      onDrop() {
        try {
          // Commit the preview to make it permanent
          commitPreview()
        } catch (error) {
          // If there's an error, rollback the preview
          rollbackPreview()
          throw error
        }
      },
      onDropTargetChange({ source, location }) {
        const destination = location.current.dropTargets[0]
        const { action } = source.data

        // if dropped outside of any drop targets
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
