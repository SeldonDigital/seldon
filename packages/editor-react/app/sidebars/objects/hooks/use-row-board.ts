import { useAddRemoveCommands } from "@app/commands/use-add-remove-commands"
import { useTool } from "@app/editor/hooks/use-tool"
import { MenuEntry } from "@app/menus"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import { useAutoSelectNode } from "@app/workspace/hooks/use-auto-select-node"
import {
  useSelectionActions,
  useStore as useSelectionStore,
} from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { IconProps } from "@seldon/components/primitives/Icon"
import { buildResetMenuEntry } from "@seldon/editor/lib/menus/reset-menu"
import { getVariantRootIds } from "@seldon/editor/lib/workspace/component-tree"
import { getComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { MouseEvent, useState } from "react"

import { Board as BoardType } from "@seldon/core"
import { getNodeKindIcon } from "@seldon/core/icon-registry"
import {
  isAuthoredBoard,
  isComponentBoard,
  isFontCollectionBoard,
  isIconSetBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"

import { useExpansion, useIsExpanded } from "./use-expansion"
import { useRowButton } from "./use-row-button"
import { useRowClick } from "./use-row-click"
import { useRowToggle } from "./use-row-toggle"
import { useIsBoardContainingSelection } from "./use-selection-relations"

/** Shown when a rename is attempted on a board whose name reflects the catalog. */
const RENAME_BOARD_BLOCKED_MESSAGE =
  "Component board names come from the catalog and can't be renamed"

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
  const boardKey = getComponentKey(board)
  const variantRootIds = getVariantRootIds(board)
  const { selectBoard } = useSelectionActions()
  const { dispatch } = useWorkspace({ usePreview: false })
  const { dispatchWithAutoSelect } = useAutoSelectNode()
  const { removeBoard, duplicatePlayground } = useAddRemoveCommands()
  const addToast = useAddToast()

  // Expansion state: toggle, expand/collapse, get descendants
  const { toggle, expandObjects, collapseObjects, getAllDescendantNodeIds } =
    useExpansion()

  // Options and configuration
  const show = options?.show ?? true

  // Selection state: each derivation is a granular store subscription, so a
  // board row only re-renders when its own selected/containing status flips.
  const isBoardSelected = useSelectionStore(
    (state) =>
      state.selectedBoardId === boardKey &&
      state.selectedNodeId === null &&
      state.selectedResourceEntry === null,
  )

  // Covers any resource board variant entry (theme, font collection, icon set,
  // or media) that lives under this board.
  const boardContainsSelectedResourceEntry = useSelectionStore(
    (state) =>
      state.selectedResourceEntry !== null &&
      variantRootIds.includes(state.selectedResourceEntry.id),
  )

  const boardContainsSelectedNode = useIsBoardContainingSelection(boardKey)
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
    if (isPlayground) {
      setEditingName(true)
    } else if (isAuthoredBoard(board)) {
      // Authored board renaming is not wired yet, so the gesture is a no-op
      // rather than showing the catalog-specific rename message.
      return
    } else {
      // Component, screen, and resource board names mirror the catalog, so the
      // rename gesture is rejected with the same feedback an instance edit gives.
      addToast(RENAME_BOARD_BLOCKED_MESSAGE)
    }
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

  function handleApplyToAllBoards() {
    const confirmed = window.confirm(
      `Apply ${board.label} board properties to all other component boards? This overwrites their board properties.`,
    )
    if (!confirmed) return
    dispatch({
      type: "apply_component_properties_to_all_boards",
      payload: { sourceBoardKey: boardKey },
    })
  }

  function buildBoardActions(): MenuEntry[] {
    if (!boardIsActive) return []

    // Authored boards have no catalog schema, so the menu offers add-variant and
    // delete but never reset-to-catalog or apply-to-all-boards.
    if (isAuthoredBoard(board)) {
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
      ]
    }

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

    const applyToAllEntries: MenuEntry[] = isComponentBoard(board)
      ? [
          {
            id: "apply-to-all-boards",
            label: "Apply to All Boards",
            onSelect: () => handleApplyToAllBoards(),
            testId: `objects-sidebar-board-${boardKey}-apply-to-all`,
          },
          "separator",
        ]
      : []

    return [
      ...applyToAllEntries,
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

  // Label: colors applied in component via tracking system. Authored boards get
  // a trailing bullet as a display-only marker; it never enters the stored name.
  const isAuthored = isAuthoredBoard(board)
  const label = {
    children: isAuthored ? `${board.label} •` : board.label,
  }

  return {
    label,
    buttonIconic,
    icon,
    icon2,
    actions,
    onClick,
    onDoubleClick,
    isEditingName,
    setEditingName,
    setPlaygroundLabel,
    isExpanded: isExpandedState,
    isBoardSelected,
    boardIsActive,
    variants: variantRootIds,
  }
}
