import { useCallback } from "react"
import { create } from "zustand"
import { getComponentSchema } from "@seldon/core/components/catalog"
import {
  ComponentLevel,
  isComponentId,
} from "@seldon/core/components/constants"
import { isComponentBoard } from "@seldon/core/workspace/model"
import type { ComponentKey } from "@seldon/core/workspace/types"
import { InstanceId, VariantId } from "@seldon/core/index"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { getNodeCatalogComponentId } from "@lib/workspace/node-tree"
import {
  getComponent,
  getComponentKey,
  getNode,
} from "@lib/workspace/workspace-accessors"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useExpansion } from "@components/sidebars/objects/hooks/use-expansion"
import { useSectionExpansion } from "@components/sidebars/hooks/use-section-expansion"
import { useWorkspace } from "./use-workspace"

/** Resource board kinds whose rows are selectable items (families, icons, media). */
export type ResourceItemKind = "font-collection" | "icon-set" | "media"

/** Serializes a resource item selection as `${resource}:${componentKey}:${entryId}:${slot}`. */
export function formatResourceItemKey(args: {
  resource: ResourceItemKind
  componentKey: string
  entryId: string
  slot: string
}): string {
  return `${args.resource}:${args.componentKey}:${args.entryId}:${args.slot}`
}

type SelectionState = {
  selectedBoardId: ComponentKey | null
  selectedNodeId: VariantId | InstanceId | null
  selectedThemeEntryId: string | null
  selectedFontCollectionEntryId: string | null
  /**
   * Selected resource item (a row inside a resource board), serialized via
   * `formatResourceItemKey` as `${resource}:${componentKey}:${entryId}:${slot}`.
   * The entry id keeps families unique across variant entries of the same board.
   * Font collection families use this now; icon sets and media reuse the same
   * field as they adopt the same board model.
   */
  selectedResourceItemKey: string | null
  selectBoard: (id: ComponentKey | null) => void
  selectNode: (id: VariantId | InstanceId | null) => void
  selectThemeEntry: (id: string | null) => void
  selectFontCollectionEntry: (id: string | null) => void
  selectResourceItem: (key: string | null) => void
}

export const useStore = create<SelectionState>()((set) => ({
  selectedBoardId: null,
  selectedNodeId: null,
  selectedThemeEntryId: null,
  selectedFontCollectionEntryId: null,
  selectedResourceItemKey: null,
  selectBoard: (id: ComponentKey | null) => {
    set({
      selectedBoardId: id,
      selectedNodeId: null,
      selectedThemeEntryId: null,
      selectedFontCollectionEntryId: null,
      selectedResourceItemKey: null,
    })
  },
  selectNode: (id: VariantId | InstanceId | null) => {
    set({
      selectedNodeId: id,
      selectedBoardId: null,
      selectedThemeEntryId: null,
      selectedFontCollectionEntryId: null,
      selectedResourceItemKey: null,
    })
  },
  selectThemeEntry: (id: string | null) => {
    set({
      selectedThemeEntryId: id,
      selectedNodeId: null,
      selectedBoardId: null,
      selectedFontCollectionEntryId: null,
      selectedResourceItemKey: null,
    })
  },
  selectFontCollectionEntry: (id: string | null) => {
    set({
      selectedFontCollectionEntryId: id,
      selectedThemeEntryId: null,
      selectedNodeId: null,
      selectedBoardId: null,
      selectedResourceItemKey: null,
    })
  },
  selectResourceItem: (key: string | null) => {
    set({
      selectedResourceItemKey: key,
      selectedNodeId: null,
      selectedBoardId: null,
      selectedThemeEntryId: null,
      selectedFontCollectionEntryId: null,
    })
  },
}))

/**
 * Reactive subscription to whether a specific node is the selected node.
 *
 * Rows use this so selecting a node only re-renders the previously and newly
 * selected rows instead of every consumer of the selection store.
 */
export const useIsNodeSelected = (id: VariantId | InstanceId): boolean =>
  useStore((state) => state.selectedNodeId === id)

/**
 * Reactive subscription to the selected node id only.
 */
export const useSelectedNodeId = (): VariantId | InstanceId | null =>
  useStore((state) => state.selectedNodeId)

/** Reactive subscription to whether a specific resource item is selected. */
export const useIsResourceItemSelected = (key: string): boolean =>
  useStore((state) => state.selectedResourceItemKey === key)

export function useSelection() {
  const { toggleSection } = useSectionExpansion()
  const { toggle: toggleObject, isExpanded } = useExpansion()
  const { autoExpandOnSelection } = useEditorConfig()

  const selectBoard = useStore((state) => state.selectBoard)
  const selectNode = useStore((state) => state.selectNode)
  const selectThemeEntry = useStore((state) => state.selectThemeEntry)
  const selectFontCollectionEntry = useStore(
    (state) => state.selectFontCollectionEntry,
  )
  const selectResourceItem = useStore((state) => state.selectResourceItem)
  const selectedBoardId = useStore((state) => state.selectedBoardId)
  const selectedNodeId = useStore((state) => state.selectedNodeId)
  const selectedThemeEntryId = useStore((state) => state.selectedThemeEntryId)
  const selectedFontCollectionEntryId = useStore(
    (state) => state.selectedFontCollectionEntryId,
  )
  const selectedResourceItemKey = useStore(
    (state) => state.selectedResourceItemKey,
  )
  const { workspace } = useWorkspace()

  const selectedNode = selectedNodeId
    ? getNode(workspace, selectedNodeId)
    : null

  const selectedBoard = selectedBoardId
    ? getComponent(workspace, selectedBoardId)
    : null

  const selection = selectedNode ?? selectedBoard

  const _selectBoard = useCallback(
    (id: ComponentKey | null) => {
      if (id === selectedBoardId) return

      selectBoard(id)
      if (id) {
        const board = workspace.components[id]
        let sectionLevel = ComponentLevel.MODULE
        if (board && isComponentBoard(board) && isComponentId(board.catalogId)) {
          sectionLevel = getComponentSchema(board.catalogId).level
        } else if (board?.type === "playground") {
          sectionLevel = ComponentLevel.SCREEN
        }

        // Always expand section for navigation
        toggleSection(sectionLevel, true)

        // Auto-expand feature: expand board itself if enabled and board is collapsed
        // (This shows the board's variants, similar to how nodes expand to show children)
        if (autoExpandOnSelection && !isExpanded(id)) {
          toggleObject(id, true)
        }
      }
    },
    [
      selectBoard,
      selectedBoardId,
      toggleSection,
      toggleObject,
      autoExpandOnSelection,
      isExpanded,
      workspace,
    ],
  )

  const _selectNode = useCallback(
    (id: VariantId | InstanceId | null) => {
      if (id === selectedNodeId) return

      selectNode(id)
      if (id) {
        // Check if node exists in workspace (virtual category nodes won't exist)
        const node = getNode(workspace, id)

        if (!node) {
          return
        }

        // Check if node was collapsed before expanding ancestors
        const wasCollapsed = !isExpanded(id)

        // Always expand ancestors for navigation (this includes the node itself)
        toggleObject(id, true, { includeAncestors: true })
        const root = workspaceService.getRootVariant(node, workspace)
        const rootEntry = getNode(workspace, root.id)
        const rootCatalogId = rootEntry
          ? getNodeCatalogComponentId(rootEntry, workspace)
          : null
        if (rootCatalogId && isComponentId(rootCatalogId)) {
          const schema = getComponentSchema(rootCatalogId)
          toggleSection(schema.level, true)
        } else {
          const board = workspaceService.findComponentForNode(node, workspace)
          if (board) {
            toggleSection(ComponentLevel.MODULE, true)
            toggleObject(getComponentKey(board), true, { includeAncestors: true })
          }
        }

        // Auto-expand feature: if disabled and node was collapsed, collapse it back
        // (Ancestors remain expanded for navigation, but node itself respects the setting)
        if (!autoExpandOnSelection && wasCollapsed) {
          toggleObject(id, false)
        }
      }
    },
    [
      selectedNodeId,
      selectNode,
      toggleObject,
      workspace,
      toggleSection,
      autoExpandOnSelection,
      isExpanded,
    ],
  )

  const _selectThemeEntry = useCallback(
    (id: string | null) => {
      if (id === selectedThemeEntryId) return
      selectThemeEntry(id)
      if (id && autoExpandOnSelection) {
        toggleObject(id, true)
      }
    },
    [
      selectThemeEntry,
      selectedThemeEntryId,
      toggleObject,
      autoExpandOnSelection,
    ],
  )

  const _selectFontCollectionEntry = useCallback(
    (id: string | null) => {
      if (id === selectedFontCollectionEntryId) return
      selectFontCollectionEntry(id)
      if (id && autoExpandOnSelection) {
        toggleObject(id, true)
      }
    },
    [
      selectFontCollectionEntry,
      selectedFontCollectionEntryId,
      toggleObject,
      autoExpandOnSelection,
    ],
  )

  const _selectResourceItem = useCallback(
    (key: string | null) => {
      if (key === selectedResourceItemKey) return
      selectResourceItem(key)
    },
    [selectResourceItem, selectedResourceItemKey],
  )

  return {
    selectBoard: _selectBoard,
    selectNode: _selectNode,
    selectThemeEntry: _selectThemeEntry,
    selectFontCollectionEntry: _selectFontCollectionEntry,
    selectResourceItem: _selectResourceItem,
    selectedNodeId,
    selectedBoardId,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
    selectedResourceItemKey,
    selectedNode,
    selectedBoard,
    selectedId:
      selectedNodeId ??
      selectedBoardId ??
      selectedThemeEntryId ??
      selectedFontCollectionEntryId,
    selection,
  }
}
