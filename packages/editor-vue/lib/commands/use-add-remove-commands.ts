import { nanoid } from "nanoid"
import { ComponentId } from "@seldon/core/components/constants"
import { InstanceId, VariantId } from "@seldon/core"
import { authoredBoardKeyFromName } from "@seldon/core/workspace/helpers/components/authored-board-key"
import { isVariantInUse } from "@seldon/core/workspace/helpers/general/is-variant-in-use"
import {
  isIconSetBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model/components"
import { isEntryFontCollectionDefault } from "@seldon/core/workspace/model/entry-font-collection"
import { isEntryIconSetDefault } from "@seldon/core/workspace/model/entry-icon-set"
import type { EntryNodeLevel } from "@seldon/core/workspace/model/entry-node"
import { isEntryThemeDefault } from "@seldon/core/workspace/model/entry-theme"
import {
  nodeRelationshipService,
  nodeRetrievalService,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import type { BoardKey } from "@seldon/core/workspace/types"
import { confirmMissingSchemaVariants } from "@seldon/editor/lib/workspace/confirm-missing-schema-variants"
import {
  findFontCollectionBoard,
  findIconSetBoard,
  findThemeBoard,
} from "@seldon/editor/lib/workspace/resource-boards"
import { resolveComponentKey } from "@seldon/editor/lib/workspace/workspace-accessors"
import { useCanvasHoverStore } from "@lib/stores/canvas-hover-store"
import { useToastStore } from "@lib/stores/toast-store"
import { useAutoSelectNode } from "@lib/workspace/use-auto-select-node"
import { useDispatch } from "@lib/workspace/use-dispatch"
import { useSelection } from "@lib/workspace/use-selection"
import { useWorkspace } from "@lib/workspace/use-workspace"
import { useToolStore } from "@lib/stores/tool-store"

/**
 * Commands for adding and removing nodes and boards. Mirrors the React
 * `useAddRemoveCommands`, dispatching the same core actions and updating the
 * selection and hover state the same way.
 */
export function useAddRemoveCommands() {
  const selection = useSelection()
  const {
    selectedNode,
    selectedBoard,
    selectedBoardId,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
    selectedIconSetEntryId,
    selectBoard,
    selectNode,
  } = selection
  const { workspace } = useWorkspace()
  const dispatch = useDispatch()
  const { dispatchWithAutoSelect } = useAutoSelectNode()
  const tool = useToolStore()
  const hover = useCanvasHoverStore()
  const toast = useToastStore()

  async function addBoard(componentId: ComponentId): Promise<void> {
    const variantFallbacks = await confirmMissingSchemaVariants(componentId)
    if (variantFallbacks === null) return

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
  }

  function addTheme(themeId: string): void {
    dispatch({ type: "add_theme", payload: { boardKey: themeId as BoardKey } })
    selectBoard(themeId as BoardKey)
  }

  function addFontCollection(catalogId: string): void {
    dispatch({ type: "add_font_collection", payload: { catalogId } })
    selectBoard(catalogId as BoardKey)
  }

  function addIconSet(catalogId: string): void {
    dispatch({ type: "add_icon_set", payload: { catalogId } })
    selectBoard(catalogId as BoardKey)
  }

  function addAuthoredComponent(payload: {
    name: string
    rootKind: "container" | "frame"
    level: EntryNodeLevel
    intent?: string
    tags?: string[]
  }): void {
    dispatch({ type: "add_authored_component", payload })
    selectBoard(authoredBoardKeyFromName(payload.name))
  }

  function addPlayground(): void {
    const playgroundKey = `playground-${nanoid(8)}` as BoardKey
    dispatch({ type: "add_playground", payload: { boardKey: playgroundKey } })
    selectBoard(playgroundKey)
  }

  function duplicatePlayground(sourcePlaygroundKey: BoardKey): void {
    const newPlaygroundKey = `playground-${nanoid(8)}` as BoardKey
    dispatch({
      type: "duplicate_playground",
      payload: { sourcePlaygroundKey, newPlaygroundKey },
    })
    selectBoard(newPlaygroundKey)
  }

  function addVariant(): void {
    const board = selectedBoard.value
    if (!board || !selectedBoardId.value) {
      toast.addToast("No board selected")
      return
    }

    if (isThemeBoard(board)) {
      const defaultThemeId = board.variants[0]?.id
      if (!defaultThemeId) return
      dispatch({ type: "duplicate_theme", payload: { themeId: defaultThemeId } })
      tool.setActiveTool("select")
      return
    }

    if (isIconSetBoard(board)) return

    if (isPlaygroundBoard(board)) {
      dispatchWithAutoSelect({
        type: "add_sandbox",
        payload: { playgroundKey: selectedBoardId.value as BoardKey },
      })
      return
    }

    dispatchWithAutoSelect({
      type: "add_variant",
      payload: { boardKey: selectedBoardId.value as BoardKey },
    })
  }

  function duplicateSelectedNode(): void {
    const nodeId = selectedNode.value?.id
    if (!nodeId) {
      toast.addToast("No node selected")
      return
    }
    dispatch({ type: "duplicate_node", payload: { nodeId } })
  }

  function removeSelectedNode(nodeId: VariantId | InstanceId): void {
    const ws = workspace.value
    const node = nodeRetrievalService.getNode(nodeId, ws)
    const isVariant = typeCheckingService.isVariant(node)

    if (isVariant && isVariantInUse(nodeId, ws)) {
      const confirmed = window.confirm(
        "This variant is used in other components. Deleting it will also remove it from those components. Delete anyway?",
      )
      if (!confirmed) return
    }

    if (selectedNode.value?.id === nodeId) {
      selectNode(
        nodeRelationshipService.findAdjacent(node, "before", ws)?.id ??
          nodeRelationshipService.findAdjacent(node, "after", ws)?.id ??
          null,
      )
    }
    if (hover.hoverState?.objectId === nodeId) {
      hover.setHoverState(null)
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
  }

  function removeBoard(boardKey: BoardKey): void {
    const ws = workspace.value
    const board = ws.boards[boardKey]
    if (!board) return

    const result = dispatch({ type: "remove_board", payload: { boardKey } })
    if (result && boardKey === selectedBoardId.value) {
      selectBoard(null)
    }
  }

  function removeSelectedThemeEntry(themeId: string): void {
    const ws = workspace.value
    const entry = ws.themes[themeId]
    if (!entry || isEntryThemeDefault(entry)) return

    if (hover.hoverState?.objectId === themeId) hover.setHoverState(null)

    dispatch({ type: "delete_theme", payload: { themeId } })

    if (selectedThemeEntryId.value === themeId) {
      const board = findThemeBoard(ws)
      selectBoard(board ? (resolveComponentKey(board, ws) as BoardKey) : null)
    }
  }

  function removeSelectedFontCollectionEntry(fontCollectionId: string): void {
    const ws = workspace.value
    const entry = ws["font-collections"][fontCollectionId]
    if (!entry || isEntryFontCollectionDefault(entry)) return

    if (hover.hoverState?.objectId === fontCollectionId) {
      hover.setHoverState(null)
    }

    dispatch({ type: "delete_font_collection", payload: { fontCollectionId } })

    if (selectedFontCollectionEntryId.value === fontCollectionId) {
      const board = findFontCollectionBoard(ws)
      selectBoard(board ? (resolveComponentKey(board, ws) as BoardKey) : null)
    }
  }

  function removeSelectedIconSetEntry(iconSetId: string): void {
    const ws = workspace.value
    const entry = ws["icon-sets"][iconSetId]
    if (!entry || isEntryIconSetDefault(entry)) return

    if (hover.hoverState?.objectId === iconSetId) hover.setHoverState(null)

    dispatch({ type: "delete_icon_set", payload: { iconSetId } })

    if (selectedIconSetEntryId.value === iconSetId) {
      const board = findIconSetBoard(ws)
      selectBoard(board ? (resolveComponentKey(board, ws) as BoardKey) : null)
    }
  }

  function deleteSelection(): void {
    if (selectedNode.value) {
      removeSelectedNode(selectedNode.value.id)
      return
    }
    if (selectedThemeEntryId.value) {
      removeSelectedThemeEntry(selectedThemeEntryId.value)
      return
    }
    if (selectedFontCollectionEntryId.value) {
      removeSelectedFontCollectionEntry(selectedFontCollectionEntryId.value)
      return
    }
    if (selectedIconSetEntryId.value) {
      removeSelectedIconSetEntry(selectedIconSetEntryId.value)
      return
    }
    if (selectedBoard.value && selectedBoardId.value) {
      removeBoard(selectedBoardId.value)
    }
  }

  function duplicateSelection(): void {
    if (!selectedNode.value) return
    duplicateSelectedNode()
  }

  return {
    addBoard,
    addTheme,
    addFontCollection,
    addIconSet,
    addAuthoredComponent,
    addPlayground,
    duplicatePlayground,
    addVariant,
    removeBoard,
    deleteSelection,
    duplicateSelection,
  }
}
