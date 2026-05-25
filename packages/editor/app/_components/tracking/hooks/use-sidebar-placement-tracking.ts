import { Placement } from "@lib/types"
import { useCallback, useMemo } from "react"
import { Instance, Variant } from "@seldon/core"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useCanvasHoverState } from "@lib/hooks/use-canvas-hover-state"
import { useTool } from "@lib/hooks/use-tool"
import { isInsertionAllowed } from "@lib/workspace/helpers/is-insertion-allowed"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useActiveBoard } from "@lib/workspace/use-active-board"
import { useWorkspace } from "@lib/workspace/use-workspace"

/**
 * Hook that handles granular placement zone tracking for sidebar rows (nodes).
 * Manages hover states, placement validation, and canvas tracking integration for
 * before/after/inside placement zones in component and sketch tools.
 *
 * @param node - The variant or instance node to track placement zones for
 * @returns Object containing placement handlers, hover state checks, and node metadata
 */
export function useSidebarPlacementTracking(node: Variant | Instance) {
  const { hoverState, setHoverState } = useCanvasHoverState()
  const { activeBoard } = useActiveBoard()
  const { workspace } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()

  const canHaveChildren = useMemo(
    () => workspaceService.canNodeHaveChildren(node),
    [node],
  )

  const parentNode = useMemo(() => {
    try {
      if (workspaceService.isBoard(node)) {
        return null
      }
      return workspaceService.findParentNode(node.id, workspace)
    } catch (error) {
      console.warn(`Could not find parent for node ${node.id}:`, error)
      return null
    }
  }, [node, workspace])

  const shouldTrackCanvas = useMemo(() => {
    if (!activeBoard) return true

    // Check if node exists in workspace (virtual nodes like categories don't exist)
    const nodeExistsInWorkspace = workspace.nodes[node.id] !== undefined
    if (!nodeExistsInWorkspace) {
      return false
    }

    try {
      const nodeBoard = workspaceService.findBoardForNode(node, workspace)
      return (
        nodeBoard !== null &&
        getComponentKey(nodeBoard) === getComponentKey(activeBoard)
      )
    } catch (error) {
      // Node doesn't exist in workspace (virtual node), skip tracking
      return false
    }
  }, [activeBoard, node, workspace])

  const getLastChildNodeBeforeCursor = useCallback(
    (placement: Placement): Instance["id"] | Variant["id"] | null => {
      if (placement !== "before" || !workspaceService.isInstance(node)) {
        return placement === "after" ? node.id : null
      }

      try {
        const adjacentNode = workspaceService.findAdjacentNode(
          node,
          "before",
          workspace,
        )
        return adjacentNode?.id ?? null
      } catch (error) {
        console.warn(`Could not find adjacent node for ${node.id}:`, error)
        return null
      }
    },
    [node, workspace],
  )

  const handlePlacementEnter = useCallback(
    (placement: Placement) => {
      if (activeTool !== "component" && activeTool !== "sketch") {
        return
      }

      if (!shouldTrackCanvas) return

      const insertionAllowed = isInsertionAllowed(
        node.id,
        placement,
        workspace,
        activeTool,
        node,
      )

      if (!insertionAllowed) {
        return
      }

      if (placement === "inside") {
        setHoverState({
          objectId: node.id,
          objectType: "node",
          placement,
          lastChildNodeBeforeCursor: null,
        })
        return
      }

      if (!parentNode) return

      setHoverState({
        objectId: parentNode.id,
        objectType: "node",
        placement,
        lastChildNodeBeforeCursor: getLastChildNodeBeforeCursor(placement),
      })
    },
    [
      node,
      parentNode,
      setHoverState,
      shouldTrackCanvas,
      activeTool,
      workspace,
      getLastChildNodeBeforeCursor,
    ],
  )

  const handlePlacementLeave = useCallback(() => {
    if (
      hoverState?.objectId === node.id ||
      hoverState?.objectId === parentNode?.id
    ) {
      setHoverState(null)
    }
  }, [hoverState, node.id, parentNode?.id, setHoverState])

  const isPlacementHovered = useCallback(
    (placement: Placement) => {
      if (!hoverState || hoverState.placement !== placement) {
        return false
      }

      if (placement === "inside") {
        return hoverState.objectId === node.id && canHaveChildren
      }

      if (!parentNode || hoverState.objectId !== parentNode.id) {
        return false
      }

      if (placement === "after") {
        return hoverState.lastChildNodeBeforeCursor === node.id
      }

      if (placement === "before") {
        try {
          const adjacentNode = workspaceService.findAdjacentNode(
            node as Instance,
            "before",
            workspace,
          )
          return adjacentNode?.id === hoverState.lastChildNodeBeforeCursor
        } catch {
          return hoverState.lastChildNodeBeforeCursor === null
        }
      }

      return false
    },
    [hoverState, node, parentNode, workspace, canHaveChildren],
  )

  const isPlacementAllowed = useCallback(
    (placement: Placement) => {
      if (activeTool !== "component" && activeTool !== "sketch") {
        return true
      }

      // Check if node exists in workspace (virtual nodes like categories don't exist)
      const nodeExistsInWorkspace = workspace.nodes[node.id] !== undefined
      if (!nodeExistsInWorkspace) {
        return false
      }

      try {
        return isInsertionAllowed(
          node.id,
          placement,
          workspace,
          activeTool,
          node,
        )
      } catch (error) {
        // Node doesn't exist in workspace (virtual node), insertion not allowed
        return false
      }
    },
    [activeTool, node, workspace],
  )

  return {
    handlePlacementEnter,
    handlePlacementLeave,
    isPlacementHovered,
    isPlacementAllowed,
    canHaveChildren,
    parentNode,
  }
}
