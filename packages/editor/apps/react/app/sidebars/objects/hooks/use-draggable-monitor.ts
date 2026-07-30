import { useMovePreviewSession } from "@app/workspace/hooks/use-move-preview-session"
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import { useEffect } from "react"

import { invariant } from "@seldon/core"

import { MOVE_NODE_ACTION } from "./use-draggable"

import type { MoveRequest } from "@app/workspace/hooks/use-move-preview-session"
import type { ElementDragPayload } from "@atlaskit/pragmatic-drag-and-drop/element/adapter"
import type { DropTargetRecord } from "@atlaskit/pragmatic-drag-and-drop/types"
import type { Instance, Variant } from "@seldon/core"
import type { Placement } from "@seldon/editor/lib/types"

/**
 * Global monitor for drag-and-drop operations in the objects sidebar. Reads the
 * hovered row band and hands it to the shared preview session, which owns the
 * settle delay, the rollback, and the commit. The row's own drop indicator
 * follows the cursor immediately; the canvas preview lags behind it.
 */
export function useDraggableMonitor() {
  const { begin, target, finish } = useMovePreviewSession()

  useEffect(() => {
    const cleanupMonitor = monitorForElements({
      canMonitor: ({ source }) => source.data.action === MOVE_NODE_ACTION,

      onDragStart() {
        begin()
      },

      onDropTargetChange({ source, location }) {
        target(buildMoveRequest(location.current.dropTargets[0], source))
      },

      onDrop({ source, location }) {
        finish(buildMoveRequest(location.current.dropTargets[0], source))
      },
    })

    return cleanupMonitor
  }, [begin, target, finish])
}

function buildMoveRequest(
  destination: DropTargetRecord | undefined,
  source: ElementDragPayload,
): MoveRequest | null {
  if (!destination) return null

  invariant(source.data.action === MOVE_NODE_ACTION, `Invalid action: ${source.data.action}`)
  const targetNode = destination.data.targetNode as Variant | Instance
  const placement = destination.data.placement as Placement
  const subjectNode = source.data.subjectNode as Variant | Instance

  invariant(targetNode, "targetNode was not set")
  invariant(placement, "placement was not set")
  invariant(subjectNode, "subjectNode was not set")

  return {
    targetNode,
    subjectNode,
    placement,
    duplicate: destination.data.duplicate === true,
  }
}
