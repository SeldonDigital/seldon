import { COLORS } from "@lib/helpers/colors"
import { useMemo } from "react"
import { CSSProperties } from "react"
import { Instance, Variant } from "@seldon/core"
import {
  nodeRelationshipService,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import { useActiveBoard } from "@lib/workspace/hooks/use-active-board"
import { useIsNodeSelected } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useHoverStateForObject } from "@lib/hooks/use-canvas-hover-state"
import { useDebugMode } from "@lib/hooks/use-debug-mode"
import { useTool } from "@lib/hooks/use-tool"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { checkInsertionPoint } from "../helpers/check-insertion-point"
import { useSharedNodeHighlight } from "./use-shared-node-highlight"

/**
 * Hook that provides styling for sidebar rows based on selection and tracking state.
 * Returns style objects and color values for:
 * - Selection styling (blue border and text)
 * - Component tool tracking styling (accent/magenta color when tracked)
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
  // Only subscribe to hover for this node, so unrelated hover moves do not
  // re-render every sidebar row.
  const hoverState = useHoverStateForObject(node.id)
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
      const nodeBoard = nodeRelationshipService.findBoardForNode(
        currentNode,
        workspace,
      )
      if (
        !nodeBoard ||
        getComponentKey(nodeBoard) !== getComponentKey(activeBoard)
      ) {
        return false
      }

      return checkInsertionPoint(
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

  const componentColor = COLORS.accent[500]

  // Show Node Types debug mode tints rows by node type: custom variants use the
  // Punch orange and instances use a light orange tint. Boards and default
  // variants keep the default white.
  const { showNodeTypes } = useDebugMode()
  const nodeTypeColor = useMemo(() => {
    if (!showNodeTypes) return undefined
    if (typeCheckingService.isInstance(currentNode)) {
      return `color-mix(in srgb, ${COLORS.punch[500]} 50%, ${COLORS.white})`
    }
    if (typeCheckingService.isUserVariant(currentNode)) {
      return COLORS.punch[500]
    }
    return undefined
  }, [showNodeTypes, currentNode])

  // Show Downstream / Chain / Family debug highlight. Primary rows are nodes
  // that change when the selection is edited; secondary rows are related
  // lineage that does not change. The selected node keeps its blue border.
  const sharedHighlight = useSharedNodeHighlight()
  const isPrimaryShared = !isSelected && sharedHighlight.primary.has(node.id)
  const isSecondaryShared =
    !isSelected && !isPrimaryShared && sharedHighlight.secondary.has(node.id)

  const rowStyle: CSSProperties = useMemo(() => {
    const style: CSSProperties = {}

    if (isSelected) {
      style.borderColor = COLORS.primary[500]
      style.outline = "none"
    } else if (isComponentTracked) {
      style.borderColor = componentColor
      // Fill the tracked row with the accent color at 6% opacity so the insert
      // target highlight reads as accent instead of the default gray hover.
      style.backgroundColor = `color-mix(in srgb, ${componentColor} 6%, transparent)`
    } else if (isPrimaryShared) {
      // Strong blue fill: editing the selection changes this node.
      style.backgroundColor = `color-mix(in srgb, ${COLORS.primary[500]} 35%, transparent)`
    } else if (isSecondaryShared) {
      // Faint blue fill: related lineage that does not change from this edit.
      style.backgroundColor = `color-mix(in srgb, ${COLORS.primary[500]} 12%, transparent)`
    }

    return Object.keys(style).length > 0 ? style : {}
  }, [
    isSelected,
    isComponentTracked,
    isPrimaryShared,
    isSecondaryShared,
    componentColor,
  ])

  const iconColor = useMemo(() => {
    if (isSelected) return COLORS.primary[500]
    if (isComponentTracked) return componentColor
    return nodeTypeColor
  }, [isSelected, isComponentTracked, componentColor, nodeTypeColor])

  const labelColor = useMemo(() => {
    if (isSelected) return COLORS.primary[500]
    if (isComponentTracked) return componentColor
    return nodeTypeColor
  }, [isSelected, isComponentTracked, componentColor, nodeTypeColor])

  return {
    rowStyle,
    iconColor,
    labelColor,
    isSelected,
    isComponentTracked,
  }
}
