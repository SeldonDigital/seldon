import { useCallback } from "react"
import { create } from "zustand"
import { getComponentSchema } from "@seldon/core/components/catalog"
import {
  ComponentLevel,
  isComponentId,
} from "@seldon/core/components/constants"
import { isComponentBoard } from "@seldon/core/workspace/model"
import type { BoardKey } from "@seldon/core/workspace/types"
import { InstanceId, VariantId } from "@seldon/core/index"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { getNodeCatalogComponentId } from "@lib/workspace/node-tree"
import {
  getComponent,
  getComponentKey,
  getNode,
} from "@lib/workspace/workspace-accessors"
import { useEditorConfig } from "@lib/hooks/use-editor-config"
import { useExpansion } from "@app/sidebars/objects/hooks/use-expansion"
import { useSectionExpansion } from "@app/sidebars/hooks/use-section-expansion"
import { useWorkspace } from "./use-workspace"

/** Resource board kinds whose rows are selectable items (families, icons, media). */
export type ResourceItemKind = "font-collection" | "icon-set" | "media"

/** Resource board kinds whose variant entries are selectable as a unit. */
export type ResourceEntryKind = "theme" | "fontCollection" | "iconSet" | "media"

/** A selected resource board variant entry, identified by its kind and entry id. */
export type SelectedResourceEntry = { kind: ResourceEntryKind; id: string }

/** Serializes a resource item selection as `${resource}:${boardKey}:${entryId}:${slot}`. */
export function formatResourceItemKey(args: {
  resource: ResourceItemKind
  boardKey: string
  entryId: string
  slot: string
}): string {
  return `${args.resource}:${args.boardKey}:${args.entryId}:${args.slot}`
}

type SelectionState = {
  selectedBoardId: BoardKey | null
  selectedNodeId: VariantId | InstanceId | null
  /**
   * The variant-root id of the column the selected node was clicked in. A child
   * node id is shared across variant columns, so this tells the canvas which
   * copy to outline. Null when the column is unknown (e.g. sidebar selection),
   * which falls back to the default variant column.
   */
  selectedNodeRootId: string | null
  /**
   * Selected resource board variant entry (theme, font collection, icon set, or
   * media). One field covers every resource board so rows share one model.
   */
  selectedResourceEntry: SelectedResourceEntry | null
  /**
   * Selected resource item (a row inside a resource board), serialized via
   * `formatResourceItemKey` as `${resource}:${boardKey}:${entryId}:${slot}`.
   * The entry id keeps families unique across variant entries of the same board.
   * Font collection families use this now; icon sets and media reuse the same
   * field as they adopt the same board model.
   */
  selectedResourceItemKey: string | null
  selectBoard: (id: BoardKey | null) => void
  selectNode: (id: VariantId | InstanceId | null, rootId?: string | null) => void
  selectResourceEntry: (kind: ResourceEntryKind, id: string | null) => void
  selectResourceItem: (key: string | null) => void
}

export const useStore = create<SelectionState>()((set) => ({
  selectedBoardId: null,
  selectedNodeId: null,
  selectedNodeRootId: null,
  selectedResourceEntry: null,
  selectedResourceItemKey: null,
  selectBoard: (id: BoardKey | null) => {
    set({
      selectedBoardId: id,
      selectedNodeId: null,
      selectedNodeRootId: null,
      selectedResourceEntry: null,
      selectedResourceItemKey: null,
    })
  },
  selectNode: (id: VariantId | InstanceId | null, rootId?: string | null) => {
    set({
      selectedNodeId: id,
      selectedNodeRootId: id ? (rootId ?? null) : null,
      selectedBoardId: null,
      selectedResourceEntry: null,
      selectedResourceItemKey: null,
    })
  },
  selectResourceEntry: (kind: ResourceEntryKind, id: string | null) => {
    set({
      selectedResourceEntry: id ? { kind, id } : null,
      selectedNodeId: null,
      selectedNodeRootId: null,
      selectedBoardId: null,
      selectedResourceItemKey: null,
    })
  },
  selectResourceItem: (key: string | null) => {
    set({
      selectedResourceItemKey: key,
      selectedNodeId: null,
      selectedNodeRootId: null,
      selectedBoardId: null,
      selectedResourceEntry: null,
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

/**
 * Reactive subscription to the variant-root column of the selected node.
 */
export const useSelectedNodeRootId = (): string | null =>
  useStore((state) => state.selectedNodeRootId)

/** Reactive subscription to whether a specific resource board entry is selected. */
export const useIsResourceEntrySelected = (
  kind: ResourceEntryKind,
  id: string,
): boolean =>
  useStore(
    (state) =>
      state.selectedResourceEntry?.kind === kind &&
      state.selectedResourceEntry?.id === id,
  )

export function useSelection() {
  const { toggleSection } = useSectionExpansion()
  const { toggle: toggleObject, isExpanded } = useExpansion()
  const { autoExpandOnSelection } = useEditorConfig()

  const selectBoard = useStore((state) => state.selectBoard)
  const selectNode = useStore((state) => state.selectNode)
  const selectResourceEntry = useStore((state) => state.selectResourceEntry)
  const selectResourceItem = useStore((state) => state.selectResourceItem)
  const selectedBoardId = useStore((state) => state.selectedBoardId)
  const selectedNodeId = useStore((state) => state.selectedNodeId)
  const selectedNodeRootId = useStore((state) => state.selectedNodeRootId)
  const selectedResourceEntry = useStore(
    (state) => state.selectedResourceEntry,
  )
  const selectedResourceItemKey = useStore(
    (state) => state.selectedResourceItemKey,
  )
  const { workspace } = useWorkspace()

  // Derived per-kind selected entry ids. These are computed projections of the
  // single `selectedResourceEntry` field, not separate state, so existing
  // read-only consumers keep their named accessors.
  const selectedThemeEntryId =
    selectedResourceEntry?.kind === "theme" ? selectedResourceEntry.id : null
  const selectedFontCollectionEntryId =
    selectedResourceEntry?.kind === "fontCollection"
      ? selectedResourceEntry.id
      : null
  const selectedIconSetEntryId =
    selectedResourceEntry?.kind === "iconSet" ? selectedResourceEntry.id : null
  const selectedMediaEntryId =
    selectedResourceEntry?.kind === "media" ? selectedResourceEntry.id : null

  const selectedNode = selectedNodeId
    ? getNode(workspace, selectedNodeId)
    : null

  const selectedBoard = selectedBoardId
    ? getComponent(workspace, selectedBoardId)
    : null

  const selection = selectedNode ?? selectedBoard

  const _selectBoard = useCallback(
    (id: BoardKey | null) => {
      if (id === selectedBoardId) return

      selectBoard(id)
      if (id) {
        const board = workspace.boards[id]
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
    (id: VariantId | InstanceId | null, rootId?: string | null) => {
      // Re-select when the same child id is clicked in a different variant-root
      // column so the selection moves to the clicked copy instead of sticking.
      if (id === selectedNodeId && (rootId ?? null) === selectedNodeRootId) {
        return
      }

      selectNode(id, rootId)
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
          const board = workspaceService.findBoardForNode(node, workspace)
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
      selectedNodeRootId,
      selectNode,
      toggleObject,
      workspace,
      toggleSection,
      autoExpandOnSelection,
      isExpanded,
    ],
  )

  const _selectResourceEntry = useCallback(
    (kind: ResourceEntryKind, id: string | null) => {
      if (
        selectedResourceEntry?.kind === kind &&
        selectedResourceEntry?.id === id
      ) {
        return
      }
      selectResourceEntry(kind, id)
      if (id && autoExpandOnSelection) {
        toggleObject(id, true)
      }
    },
    [
      selectResourceEntry,
      selectedResourceEntry,
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
    selectResourceEntry: _selectResourceEntry,
    selectResourceItem: _selectResourceItem,
    selectedNodeId,
    selectedBoardId,
    selectedResourceEntry,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
    selectedIconSetEntryId,
    selectedMediaEntryId,
    selectedResourceItemKey,
    selectedNode,
    selectedBoard,
    selectedId:
      selectedNodeId ??
      selectedBoardId ??
      selectedResourceEntry?.id ??
      null,
    selection,
  }
}
