import { MenuEntry } from "@lib/menus"
import { MouseEvent, useState } from "react"
import { Board as BoardType } from "@seldon/core"
import { getNodeKindIcon } from "@seldon/core/icon-registry"
import {
  isFontCollectionBoard,
  isIconSetBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { useAutoSelectNode } from "@lib/workspace/hooks/use-auto-select-node"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useAddRemoveCommands } from "@lib/hooks/commands/use-add-remove-commands"
import { useTool } from "@lib/hooks/use-tool"
import { getVariantRootIds } from "@lib/workspace/component-tree"
import { getComponentKey } from "@lib/workspace/workspace-accessors"
import { IconProps } from "@seldon/components/custom-components"
import { buildResetMenuEntry } from "../../shared/build-reset-menu-entry"
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
  const { removeBoard, duplicatePlayground } = useAddRemoveCommands()

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

  // Inline rename is only offered for playground containers. Component, screen,
  // and resource boards reflect the catalog and stay non-renamable.
  const isPlayground = isPlaygroundBoard(board)
  const [isEditingName, setEditingName] = useState(false)

  function onDoubleClick() {
    if (isPlayground) setEditingName(true)
  }

  function setPlaygroundLabel(label: string) {
    const trimmed = label.trim()
    setEditingName(false)
    if (!trimmed || trimmed === board.label) return
    dispatch({
      type: "set_playground_label",
      payload: { playgroundKey: boardKey, label: trimmed },
    })
  }

  function onAddVariant(event?: MouseEvent<HTMLButtonElement>) {
    event?.stopPropagation()
    event?.preventDefault()
    if (isPlaygroundBoard(board)) {
      dispatchWithAutoSelect({
        type: "add_sandbox",
        payload: { playgroundKey: boardKey },
      })
      return
    }
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
      const defaultIconSetId = board.variants[0]?.id
      if (!defaultIconSetId) return
      dispatch({
        type: "duplicate_icon_set",
        payload: { iconSetId: defaultIconSetId },
      })
      setActiveTool("select")
      return
    }
    dispatchWithAutoSelect({
      type: "add_variant",
      payload: { boardKey },
    })
  }

  function handleResetBoard() {
    if (isThemeBoard(board)) {
      const defaultThemeId = board.variants[0]?.id
      if (defaultThemeId) {
        dispatch({
          type: "reset_theme_tokens",
          payload: { themeId: defaultThemeId },
        })
      }
      return
    }
    if (isFontCollectionBoard(board)) {
      const defaultFontCollectionId = board.variants[0]?.id
      if (defaultFontCollectionId) {
        dispatch({
          type: "reset_font_collection",
          payload: { fontCollectionId: defaultFontCollectionId },
        })
      }
      return
    }
    if (isIconSetBoard(board)) {
      const defaultIconSetId = board.variants[0]?.id
      if (defaultIconSetId) {
        dispatch({
          type: "reset_icon_set",
          payload: { iconSetId: defaultIconSetId },
        })
      }
      return
    }
    const confirmed = window.confirm(
      `Reset ${board.label} to catalog? This restores the catalog default and variants and removes your custom variants and overrides.`,
    )
    if (!confirmed) return
    dispatch({
      type: "reset_component_to_catalog",
      payload: { boardKey },
    })
  }

  function buildBoardActions(): MenuEntry[] {
    if (!boardIsActive) return []

    // Playgrounds have no catalog to reset to, so the menu only offers duplicate,
    // add sandbox, and delete.
    if (isPlaygroundBoard(board)) {
      return [
        {
          id: "duplicate",
          label: `Duplicate ${board.label}`,
          onSelect: () => duplicatePlayground(boardKey),
          testId: `objects-sidebar-board-${boardKey}-duplicate`,
        },
        {
          id: "add-sandbox",
          label: "Add Sandbox",
          onSelect: () => onAddVariant(),
          testId: `objects-sidebar-board-${boardKey}-add-sandbox`,
        },
        "separator",
        {
          id: "delete",
          label: `Delete ${board.label}`,
          onSelect: () => removeBoard(boardKey),
          testId: `objects-sidebar-board-${boardKey}-delete`,
        },
      ]
    }

    return [
      {
        id: "add-variant",
        label: `Add ${board.label} Variant`,
        onSelect: () => onAddVariant(),
        testId: `objects-sidebar-board-${boardKey}-add-variant`,
      },
      "separator",
      {
        id: "delete",
        label: `Delete ${board.label}`,
        onSelect: () => removeBoard(boardKey),
        testId: `objects-sidebar-board-${boardKey}-delete`,
      },
      buildResetMenuEntry({
        label: "Reset to Catalog",
        onSelect: handleResetBoard,
        testId: `objects-sidebar-board-${boardKey}-reset`,
      }),
    ]
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
      return getNodeKindIcon("iconSet")
    }
    if (isThemeBoard(board)) {
      return getNodeKindIcon("theme")
    }
    if (isFontCollectionBoard(board)) {
      return getNodeKindIcon("fontCollection")
    }
    return getNodeKindIcon("component")
  }
  const icon2 = createIcon2(getBoardIcon() as IconProps["icon"])

  // Trailing "..." actions menu. Shown when the board is active (selected or
  // contains the selected node or resource entry).
  const actions = buildBoardActions()

  // Label: colors applied in component via tracking system
  const label = {
    children: board.label,
  }

  return {
    label,
    buttonIconic,
    icon,
    icon2,
    actions,
    onClick,
    onDoubleClick,
    isPlayground,
    isEditingName,
    setEditingName,
    setPlaygroundLabel,
    isExpanded: isExpandedState,
    isBoardSelected,
    boardIsActive,
    boardContainsSelectedNode,
    boardContainsSelectedResourceEntry,
    variants: variantRootIds,
  }
}
