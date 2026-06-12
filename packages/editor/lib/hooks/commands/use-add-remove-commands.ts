import { useCallback } from "react"
import { ComponentId } from "@seldon/core/components/constants"
import { InstanceId, VariantId } from "@seldon/core/index"
import { isVariantInUse } from "@seldon/core/workspace/helpers/general/is-variant-in-use"
import {
  isComponentBoard,
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { isEntryFontCollectionDefault } from "@seldon/core/workspace/model/entry-font-collection"
import { isEntryIconSetDefault } from "@seldon/core/workspace/model/entry-icon-set"
import { isEntryThemeDefault } from "@seldon/core/workspace/model/entry-theme"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import type { BoardKey } from "@seldon/core/workspace/types"
import { useAutoSelectNode } from "@lib/workspace/hooks/use-auto-select-node"
import { useSelection } from "@lib/workspace/hooks/use-selection"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"
import { useTool } from "@lib/hooks/use-tool"
import { confirmMissingSchemaVariants } from "@lib/workspace/confirm-missing-schema-variants"
import {
  findFontCollectionBoard,
  findIconSetBoard,
  findThemeBoard,
} from "@lib/workspace/resource-boards"
import { resolveComponentKey } from "@lib/workspace/workspace-accessors"
import { useAddToast } from "@app/toaster/hooks/use-add-toast"
import {
  getHoverStateSnapshot,
  useSetHoverState,
} from "../use-canvas-hover-state"

/**
 * Commands for adding and removing nodes and boards
 */
export function useAddRemoveCommands() {
  const {
    selectedNode,
    selectedBoard,
    selectNode,
    selectBoard,
    selectedBoardId,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
    selectedIconSetEntryId,
  } = useSelection()
  const { workspace, dispatch } = useWorkspace()
  const { dispatchWithAutoSelect } = useAutoSelectNode()
  const { setActiveTool } = useTool()
  const setHoverState = useSetHoverState()
  const addToast = useAddToast()

  const addBoard = useCallback(
    async (componentId: ComponentId) => {
      const variantFallbacks = await confirmMissingSchemaVariants(componentId)
      if (variantFallbacks === null) {
        return
      }

      dispatch({
        type: "add_component",
        payload: {
          boardKey: componentId,
          variantFallbacks: variantFallbacks.length
            ? variantFallbacks
            : undefined,
        },
      })

      selectBoard(componentId)
    },
    [dispatch, selectBoard],
  )

  const addTheme = useCallback(
    (themeId: string) => {
      dispatch({
        type: "add_theme",
        payload: { boardKey: themeId as BoardKey },
      })
      selectBoard(themeId)
    },
    [dispatch, selectBoard],
  )

  const addFontCollection = useCallback(
    (catalogId: string) => {
      dispatch({
        type: "add_font_collection",
        payload: { catalogId },
      })
      selectBoard(catalogId)
    },
    [dispatch, selectBoard],
  )

  const addIconSet = useCallback(
    (catalogId: string) => {
      dispatch({
        type: "add_icon_set",
        payload: { catalogId },
      })
      selectBoard(catalogId)
    },
    [dispatch, selectBoard],
  )

  const addVariant = useCallback(() => {
    const board = selectedBoard
    if (!board || !selectedBoardId) {
      addToast("No board selected")
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

    if (isIconSetBoard(board)) {
      return
    }

    dispatchWithAutoSelect({
      type: "add_variant",
      payload: { boardKey: selectedBoardId as BoardKey },
    })
  }, [
    selectedBoard,
    selectedBoardId,
    dispatch,
    dispatchWithAutoSelect,
    setActiveTool,
    addToast,
  ])

  const duplicateSelectedNode = useCallback(() => {
    const nodeId = selectedNode?.id
    if (!nodeId) {
      addToast("No node selected")
      return
    }

    dispatch({
      type: "duplicate_node",
      payload: { nodeId },
    })
  }, [selectedNode, dispatch, addToast])

  const removeSelectedNode = useCallback(
    (nodeId: VariantId | InstanceId) => {
      const node = workspaceService.getNode(nodeId, workspace)
      const isVariant = workspaceService.isVariant(node)

      // Deleting a variant also removes every instance of it across all other
      // components, so confirm before discarding those usages.
      if (isVariant && isVariantInUse(nodeId, workspace)) {
        const confirmed = window.confirm(
          "This variant is used in other components. Deleting it will also remove it from those components. Delete anyway?",
        )
        if (!confirmed) return
      }

      if (selectedNode?.id === nodeId) {
        selectNode(
          workspaceService.findAdjacent(node, "before", workspace)?.id ??
            workspaceService.findAdjacent(node, "after", workspace)?.id ??
            null,
        )
      }
      if (getHoverStateSnapshot()?.objectId === nodeId) {
        setHoverState(null)
      }

      if (isVariant) {
        dispatch({
          type: "remove_variant",
          payload: { variantRootId: nodeId as VariantId },
        })
        return
      }

      dispatch({
        type: "remove_instance",
        payload: { instanceId: nodeId as InstanceId },
      })
    },
    [workspace, selectedNode?.id, dispatch, selectNode, setHoverState],
  )

  const removeBoard = useCallback(
    (boardKey: BoardKey) => {
      const board = workspace.boards[boardKey]
      if (!board) return

      // Dispatch the removal that matches the board type. The default Seldon
      // theme board and icon-set boards are rejected by validation with an
      // explanatory toast.
      let result
      if (isComponentBoard(board)) {
        result = dispatch({
          type: "remove_component",
          payload: { boardKey: boardKey as ComponentId },
        })
      } else if (isPlaygroundBoard(board)) {
        result = dispatch({
          type: "remove_playground",
          payload: { boardKey },
        })
      } else if (isFontCollectionBoard(board)) {
        result = dispatch({
          type: "remove_font_collection",
          payload: { catalogId: boardKey },
        })
      } else if (isMediaBoard(board)) {
        result = dispatch({
          type: "remove_media",
          payload: { catalogId: boardKey },
        })
      } else if (isThemeBoard(board)) {
        result = dispatch({
          type: "remove_theme",
          payload: { boardKey },
        })
      } else if (isIconSetBoard(board)) {
        result = dispatch({
          type: "remove_icon_set",
          payload: { catalogId: boardKey },
        })
      }

      // Only clear the selection when the board was actually removed. A rejected
      // removal (e.g. the Seldon theme board) leaves the selection unchanged.
      if (result && boardKey === selectedBoardId) {
        selectBoard(null)
      }
    },
    [workspace, selectedBoardId, selectBoard, dispatch],
  )

  const removeSelectedThemeEntry = useCallback(
    (themeId: string) => {
      const entry = workspace.themes[themeId]
      if (!entry || isEntryThemeDefault(entry)) return

      if (getHoverStateSnapshot()?.objectId === themeId) {
        setHoverState(null)
      }

      dispatch({
        type: "delete_theme",
        payload: { themeId },
      })

      if (selectedThemeEntryId === themeId) {
        const board = findThemeBoard(workspace)
        selectBoard(board ? resolveComponentKey(board, workspace) : null)
      }
    },
    [workspace, selectedThemeEntryId, selectBoard, dispatch, setHoverState],
  )

  const removeSelectedFontCollectionEntry = useCallback(
    (fontCollectionId: string) => {
      const entry = workspace["font-collections"][fontCollectionId]
      if (!entry || isEntryFontCollectionDefault(entry)) return

      if (getHoverStateSnapshot()?.objectId === fontCollectionId) {
        setHoverState(null)
      }

      dispatch({
        type: "delete_font_collection",
        payload: { fontCollectionId },
      })

      if (selectedFontCollectionEntryId === fontCollectionId) {
        const board = findFontCollectionBoard(workspace)
        selectBoard(board ? resolveComponentKey(board, workspace) : null)
      }
    },
    [
      workspace,
      selectedFontCollectionEntryId,
      selectBoard,
      dispatch,
      setHoverState,
    ],
  )

  const removeSelectedIconSetEntry = useCallback(
    (iconSetId: string) => {
      const entry = workspace["icon-sets"][iconSetId]
      if (!entry || isEntryIconSetDefault(entry)) return

      if (getHoverStateSnapshot()?.objectId === iconSetId) {
        setHoverState(null)
      }

      dispatch({
        type: "delete_icon_set",
        payload: { iconSetId },
      })

      if (selectedIconSetEntryId === iconSetId) {
        const board = findIconSetBoard(workspace)
        selectBoard(board ? resolveComponentKey(board, workspace) : null)
      }
    },
    [workspace, selectedIconSetEntryId, selectBoard, dispatch, setHoverState],
  )

  const deleteSelection = useCallback(() => {
    if (selectedNode) {
      removeSelectedNode(selectedNode.id)
      return
    }

    if (selectedThemeEntryId) {
      removeSelectedThemeEntry(selectedThemeEntryId)
      return
    }

    if (selectedFontCollectionEntryId) {
      removeSelectedFontCollectionEntry(selectedFontCollectionEntryId)
      return
    }

    if (selectedIconSetEntryId) {
      removeSelectedIconSetEntry(selectedIconSetEntryId)
      return
    }

    if (selectedBoard && selectedBoardId) {
      removeBoard(selectedBoardId)
    }
  }, [
    selectedNode,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
    selectedIconSetEntryId,
    selectedBoard,
    selectedBoardId,
    removeSelectedNode,
    removeSelectedThemeEntry,
    removeSelectedFontCollectionEntry,
    removeSelectedIconSetEntry,
    removeBoard,
  ])

  const duplicateSelection = useCallback(() => {
    if (!selectedNode) return

    duplicateSelectedNode()
  }, [selectedNode, duplicateSelectedNode])

  return {
    addBoard,
    addTheme,
    addFontCollection,
    addIconSet,
    addVariant,
    removeBoard,
    deleteSelection,
    duplicateSelection,
  }
}
