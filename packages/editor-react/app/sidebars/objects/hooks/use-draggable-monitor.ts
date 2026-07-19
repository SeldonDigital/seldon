import {
  ElementDragPayload,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import type { DropTargetRecord } from "@atlaskit/pragmatic-drag-and-drop/types"
import { Placement } from "@lib/types"
import { useEffect } from "react"
import { Instance, Variant, invariant } from "@seldon/core"
import { useMoveObjects } from "@app/workspace/hooks/use-move-objects"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { useDragStateStore } from "@app/hooks/use-drag-state"

/**
 * How long the hovered target must stay settled before the canvas preview is
 * written. Sweeping the cursor across several rows keeps resetting this timer,
 * so the intermediate targets never reach the canvas and the dragged node
 * animates to the slot the cursor pauses on in a single move.
 */
const PREVIEW_SETTLE_MS = 150

/**
 * Global monitor for drag-and-drop operations in the objects sidebar.
 * Listens for node movement events.
 *
 * The sidebar's own drop indicator follows the cursor immediately. The canvas
 * preview is debounced: it is written only after the hovered target stays
 * settled for `PREVIEW_SETTLE_MS`, so a fast multi-row drag animates the canvas
 * straight to the settled slot instead of stepping through every slot crossed.
 * On drop the move is committed once and the preview is discarded; dropping
 * outside a target discards the preview.
 */
export function useDraggableMonitor() {
  const {
    moveNodeNextTo,
    moveNodeInside,
    duplicateNodeInside,
    duplicateNodeNextTo,
  } = useMoveObjects()
  const { startPreviewSession, rollbackPreview } = useWorkspace()
  const setIsDragging = useDragStateStore((state) => state.setIsDragging)

  useEffect(() => {
    let settleTimer: ReturnType<typeof setTimeout> | null = null

    const clearSettleTimer = () => {
      if (settleTimer !== null) {
        clearTimeout(settleTimer)
        settleTimer = null
      }
    }

    const applyMove = (
      destination: DropTargetRecord,
      source: ElementDragPayload,
      isPreview: boolean,
    ) => {
      const { action } = source.data

      switch (action) {
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

    const cleanupMonitor = monitorForElements({
      canMonitor: ({ source }) =>
        source.data.action === "object-panel-move-node",

      onDragStart() {
        setIsDragging(true)
        startPreviewSession()
      },

      onDropTargetChange({ source, location }) {
        const destination = location.current.dropTargets[0]
        clearSettleTimer()

        // No target under the cursor: drop the preview right away so the canvas
        // returns to the committed order without waiting on the settle timer.
        if (!destination) {
          rollbackPreview()
          return
        }

        // Write the preview only once the cursor settles on this target. A new
        // target change before the timer fires cancels it above, so rows merely
        // passed over never reach the canvas.
        settleTimer = setTimeout(() => {
          settleTimer = null
          applyMove(destination, source, true)
        }, PREVIEW_SETTLE_MS)
      },

      onDrop({ source, location }) {
        clearSettleTimer()
        const destination = location.current.dropTargets[0]

        // Commit the move while the preview is still active, then discard the
        // preview. The preview already holds the reordered state, so both the
        // commit and the rollback render the same order. Rolling back first
        // would briefly show the original order, flashing the node back to its
        // start before animating forward again.
        if (destination) {
          applyMove(destination, source, false)
        }
        rollbackPreview()
        setIsDragging(false)
      },
    })

    return () => {
      clearSettleTimer()
      cleanupMonitor()
    }
  }, [
    moveNodeNextTo,
    moveNodeInside,
    duplicateNodeInside,
    duplicateNodeNextTo,
    startPreviewSession,
    rollbackPreview,
    setIsDragging,
  ])
}
