import { useCallback, useMemo } from "react"
import { InstanceId, VariantId } from "@seldon/core/index"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useCanvasHoverState } from "@lib/hooks/use-canvas-hover-state"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useActiveBoard } from "@lib/workspace/use-active-board"
import { useWorkspace } from "@lib/workspace/use-workspace"

export type BelongsToActiveBoardResult = {
  /** Whether the current canvas hover target belongs to the active board. */
  hoverBelongsToActiveBoard: boolean
  /** Whether a node id belongs to the active board's component tree. */
  nodeBelongsToActiveBoard: (nodeId: VariantId | InstanceId) => boolean
}

/**
 * Checks board membership for canvas hover targets and for individual node ids.
 *
 * @returns Hover flag for insertion/select overlays and a per-node checker for visible-node filtering.
 */
export function useBelongsToActiveBoard(): BelongsToActiveBoardResult {
  const { hoverState } = useCanvasHoverState()
  const { activeBoard } = useActiveBoard()
  const { workspace } = useWorkspace()

  const nodeBelongsToActiveBoard = useCallback(
    (nodeId: VariantId | InstanceId) => {
      if (!activeBoard) return false

      try {
        const node = workspaceService.getNode(nodeId, workspace)
        const nodeBoard = workspaceService.findBoardForNode(node, workspace)
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
