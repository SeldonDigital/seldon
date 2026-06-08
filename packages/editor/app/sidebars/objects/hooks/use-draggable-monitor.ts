import {
  ElementDragPayload,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import type { DropTargetRecord } from "@atlaskit/pragmatic-drag-and-drop/types"
import { Placement } from "@lib/types"
import { useEffect } from "react"
import { Board, Instance, Variant, invariant } from "@seldon/core"
import { useMoveObjects } from "@lib/workspace/hooks/use-move-objects"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"

/**
 * Global monitor for drag-and-drop operations in the objects sidebar.
 * Listens for board reordering and node movement events.
 *
 * While dragging, each change of the hovered drop target writes a preview of
 * the move so the canvas reflects the new order live. On drop the preview is
 * discarded and the move is committed once as a semantic action; dropping
 * outside a target discards the preview.
 */
export function useDraggableMonitor() {
  const {
    moveNodeNextTo,
    moveBoardNextTo,
    moveNodeInside,
    duplicateNodeInside,
    duplicateNodeNextTo,
  } = useMoveObjects()
  const { startPreviewSession, rollbackPreview } = useWorkspace()

  useEffect(() => {
    const applyMove = (
      destination: DropTargetRecord,
      source: ElementDragPayload,
      isPreview: boolean,
    ) => {
      const { action } = source.data

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
            isPreview,
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
              duplicateNodeInside({ targetNode, subjectNode, isPreview })
            } else {
              moveNodeInside({ targetNode, subjectNode, isPreview })
            }
          } else {
            if (duplicate) {
              duplicateNodeNextTo({
                targetNode,
                subjectNode,
                position: placement,
                isPreview,
              })
            } else {
              moveNodeNextTo({
                targetNode,
                subjectNode,
                position: placement,
                isPreview,
              })
            }
          }
          break
        }
        default: {
          throw new Error(`Invalid action: ${action}`)
        }
      }
    }

    return monitorForElements({
      canMonitor: ({ source }) =>
        source.data.action === "object-panel-move-node" ||
        source.data.action === "object-panel-reorder-board",

      onDragStart() {
        startPreviewSession()
      },

      onDropTargetChange({ source, location }) {
        const destination = location.current.dropTargets[0]
        if (!destination) {
          rollbackPreview()
          return
        }
        applyMove(destination, source, true)
      },

      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0]

        // Discard the preview before committing so the canvas falls back to
        // committed state, then apply the move once as a semantic action.
        rollbackPreview()

        if (!destination) return

        applyMove(destination, source, false)
      },
    })
  }, [
    moveNodeNextTo,
    moveBoardNextTo,
    moveNodeInside,
    duplicateNodeInside,
    duplicateNodeNextTo,
    startPreviewSession,
    rollbackPreview,
  ])
}
