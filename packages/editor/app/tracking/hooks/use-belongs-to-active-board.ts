import { useCallback, useMemo } from "react"
import { InstanceId, VariantId } from "@seldon/core/index"
import {
  nodeRelationshipService,
  nodeRetrievalService,
} from "@seldon/core/workspace/services"
import { useActiveBoard } from "@lib/workspace/hooks/use-active-board"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useCanvasHoverState } from "@lib/hooks/use-canvas-hover-state"
import { getComponentKey } from "@lib/workspace/workspace-accessors"

export type BelongsToActiveBoardResult = {
  /** Whether the current canvas hover target belongs to the active board. */
  hoverBelongsToActiveBoard: boolean
  /** Whether a node id belongs to the active board's component tree. */
  nodeBelongsToActiveBoard: (nodeId: VariantId | InstanceId) => boolean
}

/**
 * Per-node board-membership checker without any hover subscription.
 *
 * Consumers that only filter nodes by board (e.g. visible-node tracking) use
 * this so they never re-render on hover changes.
 *
 * @returns A checker for whether a node id belongs to the active board.
 */
export function useNodeBelongsToActiveBoard(): (
  nodeId: VariantId | InstanceId,
) => boolean {
  const { activeBoard } = useActiveBoard()
  const { workspace } = useWorkspace()

  return useCallback(
    (nodeId: VariantId | InstanceId) => {
      if (!activeBoard) return false

      try {
        const node = nodeRetrievalService.getNode(nodeId, workspace)
        const nodeBoard = nodeRelationshipService.findBoardForNode(node, workspace)
        return (
          nodeBoard !== null &&
          getComponentKey(nodeBoard) === getComponentKey(activeBoard)
        )
      } catch {
        return false
      }
    },
    [activeBoard, workspace],
  )
}

/**
 * Checks board membership for canvas hover targets and for individual node ids.
 *
 * @returns Hover flag for insertion/select overlays and a per-node checker for visible-node filtering.
 */
export function useBelongsToActiveBoard(): BelongsToActiveBoardResult {
  const { hoverState } = useCanvasHoverState()
  const { activeBoard } = useActiveBoard()
  const nodeBelongsToActiveBoard = useNodeBelongsToActiveBoard()

  const hoverBelongsToActiveBoard = useMemo(() => {
    if (!hoverState || !activeBoard) return false

    const activeBoardKey = getComponentKey(activeBoard)

    if (hoverState.objectType === "board") {
      return hoverState.objectId === activeBoardKey
    }

    return nodeBelongsToActiveBoard(
      hoverState.objectId as VariantId | InstanceId,
    )
  }, [activeBoard, hoverState, nodeBelongsToActiveBoard])

  return { hoverBelongsToActiveBoard, nodeBelongsToActiveBoard }
}
