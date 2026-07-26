import {
  getHoverStateSnapshot,
  useSetHoverState,
} from "@app/canvas/hooks/use-canvas-hover-state"
import { useTool } from "@app/editor/hooks/use-tool"
import { useActiveBoard } from "@app/workspace/hooks/use-active-board"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import {
  getComponentKey,
  hasNode,
} from "@seldon/editor/lib/workspace/workspace-accessors"
import { useCallback } from "react"

import { Board, Instance, Variant } from "@seldon/core"
import { nodeRelationshipService } from "@seldon/core/workspace/services"

import { checkInsertionPoint } from "../helpers/check-insertion-point"

/**
 * Hook that handles canvas hover tracking for sidebar rows (nodes).
 * Sets hover state when hovering over the entire row for all tools:
 * - Select tool: Shows wireframe outlines on canvas
 * - Component tool: Shows insertion indicators on canvas
 *
 * Note: This handles row-level hover, while SidebarTracking handles granular
 * placement zones (before/after/inside).
 *
 * @param node - The variant or instance node to track
 * @returns Object containing canvas tracking enter/leave handlers
 */
export function useSidebarCanvasTracking(node: Variant | Instance) {
  const setHoverState = useSetHoverState()
  const { activeBoard } = useActiveBoard()
  const { workspace } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()

  // Check if node exists in workspace (virtual nodes like categories don't exist)
  const nodeExistsInWorkspace = hasNode(workspace, node.id)

  const handleCanvasTrackingEnter = useCallback(() => {
    if (!activeBoard || !nodeExistsInWorkspace) return

    try {
      const nodeBoard = nodeRelationshipService.findBoardForNode(
        node,
        workspace,
      )
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

    // Select-mode highlighting flows through the shared hover bridge now; this
    // hook only feeds component insertion previews.
    if (activeTool === "component") {
      const insertionAllowed = checkInsertionPoint(
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
    const hoverState = getHoverStateSnapshot()
    if (hoverState?.objectId === node.id && hoverState?.objectType === "node") {
      setHoverState(null)
    }
  }, [node.id, setHoverState])

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
  const setHoverState = useSetHoverState()
  const { activeBoard } = useActiveBoard()
  const { activeTool } = useTool()
  const boardKey = getComponentKey(board)

  const handleCanvasTrackingEnter = useCallback(() => {
    // Board insertion preview is a component-tool concern; select-mode hover
    // runs through the shared hover bridge.
    if (activeTool !== "component") return
    if (!activeBoard || boardKey !== getComponentKey(activeBoard)) return

    setHoverState({
      objectId: boardKey,
      objectType: "board",
      placement: "inside",
      lastChildNodeBeforeCursor: null,
    })
  }, [boardKey, activeBoard, activeTool, setHoverState])

  const handleCanvasTrackingLeave = useCallback(() => {
    const hoverState = getHoverStateSnapshot()
    if (
      hoverState?.objectId === boardKey &&
      hoverState?.objectType === "board"
    ) {
      setHoverState(null)
    }
  }, [boardKey, setHoverState])

  return {
    handleCanvasTrackingEnter,
    handleCanvasTrackingLeave,
  }
}
