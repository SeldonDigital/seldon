import { MouseEvent } from "react"
import { Board as BoardType } from "@seldon/core"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useAutoSelectNode } from "@lib/workspace/hooks/use-auto-select-node"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useTool } from "@lib/hooks/use-tool"
import { getVariantRootIds } from "@lib/workspace/component-tree"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { IconProps } from "@seldon/components/custom-components"
import { useExpansion, useIsExpanded } from "./use-expansion"
import { useRowButton } from "./use-row-button"
import { useRowClick } from "./use-row-click"
import { useRowToggle } from "./use-row-toggle"
import { useSelectionRelations } from "./use-selection-relations"

/**
 * Hook that provides all state and handlers for rendering a board row in the objects sidebar.
 * Handles board selection, expansion, variant management, and button/icon configuration.
 *
 * @param board - The board to render
 * @param options - Optional configuration for visibility and drag-and-drop
 * @returns Object containing label, buttons, handlers, and state for the board row
 */
export function useRowBoard(
  board: BoardType,
  options?: {
    show?: boolean
  },
) {
  // Core workspace and tool state
  const { activeTool, setActiveTool } = useTool()
  const {
    selectBoard,
    selectedBoardId,
    selectedNodeId,
    selectedResourceEntry,
  } = useSelection()
  const { selectedNodeBoardKey } = useSelectionRelations()
  const { dispatch } = useWorkspace({ usePreview: false })
  const { dispatchWithAutoSelect } = useAutoSelectNode()

  // Expansion state: toggle, expand/collapse, get descendants
  const { toggle, expandObjects, collapseObjects, getAllDescendantNodeIds } =
    useExpansion()

  // Options and configuration
  const show = options?.show ?? true

  // Selection state: determine if board is selected or contains selected node
  const boardKey = getComponentKey(board)
  const variantRootIds = getVariantRootIds(board)

  const isBoardSelected =
    selectedBoardId === boardKey &&
    selectedNodeId === null &&
    selectedResourceEntry === null

  // Covers any resource board variant entry (theme, font collection, icon set,
  // or media) that lives under this board.
  const boardContainsSelectedResourceEntry =
    selectedResourceEntry !== null &&
    variantRootIds.includes(selectedResourceEntry.id)

  const boardContainsSelectedNode =
    selectedNodeBoardKey !== null && selectedNodeBoardKey === boardKey
  const boardIsActive =
    isBoardSelected ||
    boardContainsSelectedNode ||
    boardContainsSelectedResourceEntry
  const hasVariantChildren = variantRootIds.length > 0

  // Expansion state
  const expandedId = boardKey
  const isExpandedState = useIsExpanded(expandedId)

  // Event handlers: toggle expansion, select board, add variant
  const onToggle = useRowToggle({
    expandedId,
    isExpanded: isExpandedState,
    toggle,
    expandObjects,
    collapseObjects,
    getAllIdsForAltClick: () => {
      const allIds: string[] = [expandedId]
      variantRootIds.forEach((variantId) => {
        allIds.push(variantId)
        const descendantIds = getAllDescendantNodeIds(variantId)
        allIds.push(...descendantIds)
      })
      return allIds
    },
    hasChildren: hasVariantChildren,
  })

  const onClick = useRowClick({
    activeTool,
    onSelect: () => selectBoard(boardKey),
  })

  function onAddVariant(event?: MouseEvent<HTMLButtonElement>) {
    event?.stopPropagation()
    event?.preventDefault()
    if (isThemeBoard(board)) {
      const defaultThemeId = board.variants[0]?.id
      if (!defaultThemeId) return
      dispatch({
        type: "duplicate_theme",
        payload: { themeId: defaultThemeId },
      })
      setActiveTool("select")
      return
    }
    if (isFontCollectionBoard(board)) {
      // Duplicate the default entry to create a new font collection variant,
      // mirroring the theme add-variant flow.
      const defaultFontCollectionId = board.variants[0]?.id
      if (!defaultFontCollectionId) return
      dispatch({
        type: "duplicate_font_collection",
        payload: { fontCollectionId: defaultFontCollectionId },
      })
      setActiveTool("select")
      return
    }
    if (isIconSetBoard(board)) {
      return
    }
    dispatchWithAutoSelect({
      type: "add_variant",
      payload: { boardKey },
    })
  }

  // Button and icon creation: toggle button, component icon, add variant button
  const { createToggleButton, createToggleIcon, createIcon2 } = useRowButton({
    isExpanded: isExpandedState,
    isSelected: boardIsActive,
    hasChildren: hasVariantChildren,
    onToggle,
  })

  // Toggle button (first icon): chevron that rotates on expand
  const icon = createToggleIcon()
  const buttonIconic = createToggleButton()

  // Component icon (second icon): shows component type
  const getBoardIcon = () => {
    if (isIconSetBoard(board)) {
      return "seldon-icon"
    }
    if (isThemeBoard(board)) {
      return "seldon-theme"
    }
    if (isFontCollectionBoard(board)) {
      return "seldon-text"
    }
    return "seldon-component"
  }
  const icon2 = createIcon2(getBoardIcon() as IconProps["icon"])

  // Add variant button (mid action after the label)
  // Shown when board is active (selected or contains selected node)
  const createAddVariantButton = () => {
    if (!boardIsActive) {
      return { icon: undefined, button: undefined }
    }

    return {
      icon: { icon: "material-add" as const } as IconProps,
      button: {
        onClick: onAddVariant,
        style: {
          position: "relative" as const,
          zIndex: 10,
        },
      },
    }
  }

  const { icon: icon3, button: buttonIconic2 } = createAddVariantButton()

  // Label: colors applied in component via tracking system
  const label = {
    children: board.label,
  }

  return {
    label,
    buttonIconic,
    icon,
    icon2,
    buttonIconic2,
    icon3,
    onClick,
    isExpanded: isExpandedState,
    isBoardSelected,
    boardIsActive,
    boardContainsSelectedNode,
    boardContainsSelectedResourceEntry,
    variants: variantRootIds,
  }
}
