import { COLORS } from "@lib/utils/colors"
import { useMemo } from "react"
import { CSSProperties } from "react"
import { Instance, Variant } from "@seldon/core"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useCanvasHoverState } from "@lib/hooks/use-canvas-hover-state"
import { useTool } from "@lib/hooks/use-tool"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { useActiveBoard } from "@lib/workspace/use-active-board"
import { useIsNodeSelected } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { checkInsertionAllowed } from "../utils/check-insertion-allowed"

/**
 * Hook that provides styling for sidebar rows based on selection and tracking state.
 * Returns style objects and color values for:
 * - Selection styling (blue border and text)
 * - Component tool tracking styling (accent/magenta color when tracked)
 * - Sketch tool tracking styling (orange/punch color when tracked)
 *
 * @param node - The variant or instance node to style
 * @returns Object containing row styles, icon color, label color, and tracking state flags
 */
export function useSidebarRowStyling(
  node: Variant | Instance,
  options?: { isSelected?: boolean },
) {
  const { workspace } = useWorkspace({ usePreview: false })
  const { activeTool } = useTool()
  const { hoverState } = useCanvasHoverState()
  const { activeBoard } = useActiveBoard()
  const isNodeSelected = useIsNodeSelected(node.id)

  // Allow override of selection state (for boards) or use default node selection check
  const isSelected =
    options?.isSelected !== undefined ? options.isSelected : isNodeSelected

  // Get fresh node from workspace to ensure we have latest data
  // Check if node exists in workspace (virtual nodes like categories don't exist)
  const nodeExistsInWorkspace = workspace.nodes[node.id] !== undefined
  const currentNode = nodeExistsInWorkspace
    ? workspace.nodes[node.id] || node
    : node

  // Check if this node is being tracked for component tool
  const isComponentTracked = useMemo(() => {
    if (!nodeExistsInWorkspace) return false
    if (activeTool !== "component") return false
    if (!hoverState) return false
    if (hoverState.objectId !== currentNode.id) return false
    if (hoverState.objectType !== "node") return false

    if (!activeBoard) return false
    try {
      const nodeBoard = workspaceService.findBoardForNode(
        currentNode,
        workspace,
      )
      if (
        !nodeBoard ||
        getComponentKey(nodeBoard) !== getComponentKey(activeBoard)
      ) {
        return false
      }

      return checkInsertionAllowed(
        currentNode.id,
        "node",
        hoverState.placement || "inside",
        workspace,
        "component",
      )
    } catch (error) {
      // Node doesn't exist in workspace (virtual node), skip tracking
      return false
    }
  }, [
    activeTool,
    hoverState,
    currentNode,
    activeBoard,
    workspace,
    nodeExistsInWorkspace,
  ])

  const isSketchTracked = useMemo(() => {
    if (!nodeExistsInWorkspace) return false
    if (activeTool !== "sketch") return false
    if (!hoverState) return false
    if (hoverState.objectId !== currentNode.id) return false
    if (hoverState.objectType !== "node") return false

    if (!activeBoard) return false
    try {
      const nodeBoard = workspaceService.findBoardForNode(
        currentNode,
        workspace,
      )
      if (
        !nodeBoard ||
        getComponentKey(nodeBoard) !== getComponentKey(activeBoard)
      ) {
        return false
      }

      return checkInsertionAllowed(
        currentNode.id,
        "node",
        hoverState.placement || "inside",
        workspace,
        "sketch",
      )
    } catch (error) {
      // Node doesn't exist in workspace (virtual node), skip tracking
      return false
    }
  }, [
    activeTool,
    hoverState,
    currentNode,
    activeBoard,
    workspace,
    nodeExistsInWorkspace,
  ])

  const componentColor = COLORS.accent[500]
  const sketchColor = COLORS.punch[500]

  const rowStyle: CSSProperties = useMemo(() => {
    const style: CSSProperties = {}

    if (isSelected) {
      style.borderColor = COLORS.primary[500]
      style.outline = "none"
    } else if (isComponentTracked) {
      style.borderColor = componentColor
    } else if (isSketchTracked) {
      style.borderColor = sketchColor
    }

    return Object.keys(style).length > 0 ? style : {}
  }, [
    isSelected,
    isComponentTracked,
    isSketchTracked,
    componentColor,
    sketchColor,
  ])

  const iconColor = useMemo(() => {
    if (isSelected) return COLORS.primary[500]
    if (isComponentTracked) return componentColor
    if (isSketchTracked) return sketchColor
    return undefined
  }, [
    isSelected,
    isComponentTracked,
    isSketchTracked,
    componentColor,
    sketchColor,
  ])

  const labelColor = useMemo(() => {
    if (isSelected) return COLORS.primary[500]
    if (isComponentTracked) return componentColor
    if (isSketchTracked) return sketchColor
    return undefined
  }, [
    isSelected,
    isComponentTracked,
    isSketchTracked,
    componentColor,
    sketchColor,
  ])

  return {
    rowStyle,
    iconColor,
    labelColor,
    isSelected,
    isComponentTracked,
    isSketchTracked,
  }
}
