import { useCallback } from "react"
import { Board, Instance, Variant } from "@seldon/core"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useCanvasHoverState } from "@lib/hooks/use-canvas-hover-state"
import { useTool } from "@lib/hooks/use-tool"
import { useActiveBoard } from "@lib/workspace/use-active-board"
import { getComponentKey, hasNode } from "@lib/workspace/workspace-accessors"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { checkInsertionAllowed } from "../utils/check-insertion-allowed"

/**
 * Hook that handles canvas hover tracking for sidebar rows (nodes).
 * Sets hover state when hovering over the entire row for all tools:
 * - Select tool: Shows wireframe outlines on canvas
 * - Component/Sketch tools: Shows insertion indicators on canvas
 *
 * Note: This handles row-level hover, while SidebarTracking handles granular
 * placement zones (before/after/inside).
 *
 * @param node - The variant or instance node to track
 * @returns Object containing canvas tracking enter/leave handlers
 */
export function useSidebarCanvasTracking(node: Variant | Instance) {
  const { hoverState, setHoverState } = useCanvasHoverState()
  const { activeBoard } = useActiveBoard()
  const { workspace } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()

  // Check if node exists in workspace (virtual nodes like categories don't exist)
  const nodeExistsInWorkspace = hasNode(workspace, node.id)

  const handleCanvasTrackingEnter = useCallback(() => {
    if (!activeBoard || !nodeExistsInWorkspace) return

    try {
      const nodeBoard = workspaceService.findBoardForNode(node, workspace)
      if (
        !nodeBoard ||
        getComponentKey(nodeBoard) !== getComponentKey(activeBoard)
      ) {
        return
      }
    } catch (error) {
      // Node doesn't exist in workspace (virtual node), skip tracking
      return
    }

    if (activeTool === "select") {
      setHoverState({
        objectId: node.id,
        objectType: "node",
        placement: "inside",
        lastChildNodeBeforeCursor: null,
      })
    } else if (activeTool === "component" || activeTool === "sketch") {
      const insertionAllowed = checkInsertionAllowed(
        node.id,
        "node",
        "inside",
        workspace,
        activeTool,
      )

      if (insertionAllowed) {
        setHoverState({
          objectId: node.id,
          objectType: "node",
          placement: "inside",
          lastChildNodeBeforeCursor: null,
        })
      }
    }
  }, [
    node,
    activeBoard,
    workspace,
    activeTool,
    setHoverState,
    nodeExistsInWorkspace,
  ])

  const handleCanvasTrackingLeave = useCallback(() => {
    if (hoverState?.objectId === node.id && hoverState?.objectType === "node") {
      setHoverState(null)
    }
  }, [hoverState, node.id, setHoverState])

  return {
    handleCanvasTrackingEnter,
    handleCanvasTrackingLeave,
  }
}

/**
 * Hook that handles canvas hover tracking for sidebar rows (boards).
 * Sets hover state when hovering over a board row for all tools.
 * Boards don't show wireframes in select mode, but do show insertion indicators.
 *
 * @param board - The board to track
 * @returns Object containing canvas tracking enter/leave handlers
 */
export function useSidebarCanvasTrackingBoard(board: Board) {
  const { hoverState, setHoverState } = useCanvasHoverState()
  const { activeBoard } = useActiveBoard()
  const boardKey = getComponentKey(board)

  const handleCanvasTrackingEnter = useCallback(() => {
    if (!activeBoard || boardKey !== getComponentKey(activeBoard)) return

    setHoverState({
      objectId: boardKey,
      objectType: "board",
      placement: "inside",
      lastChildNodeBeforeCursor: null,
    })
  }, [boardKey, activeBoard, setHoverState])

  const handleCanvasTrackingLeave = useCallback(() => {
    if (
      hoverState?.objectId === boardKey &&
      hoverState?.objectType === "board"
    ) {
      setHoverState(null)
    }
  }, [hoverState, boardKey, setHoverState])

  return {
    handleCanvasTrackingEnter,
    handleCanvasTrackingLeave,
  }
}
