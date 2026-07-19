import { useCallback } from "react"
import { create } from "zustand"
import { getComponentSchema } from "@seldon/core/components/catalog"
import {
  ComponentLevel,
  isComponentId,
} from "@seldon/core/components/constants"
import { Instance, InstanceId, Variant, VariantId } from "@seldon/core/index"
import {
  isComponentBoard,
  isFontCollectionBoard,
  isIconSetBoard,
  isMediaBoard,
  isPlaygroundBoard,
  isThemeBoard,
} from "@seldon/core/workspace/model"
import type { Board } from "@seldon/core/workspace/model/components"
import { nodeRelationshipService } from "@seldon/core/workspace/services"
import type { BoardKey } from "@seldon/core/workspace/types"
import type { ResourceEntryKind } from "@lib/workspace/selection-kind"
import { useEditorConfig } from "@app/hooks/use-editor-config"
import { getNodeCatalogComponentId } from "@lib/workspace/node-tree"
import {
  getComponent,
  getComponentKey,
  getNode,
} from "@lib/workspace/workspace-accessors"
import {
  ExpandableSection,
  useSectionExpansion,
} from "@app/sidebars/hooks/use-section-expansion"
import { useExpansion } from "@app/sidebars/objects/hooks/use-expansion"
import { getCurrentWorkspace } from "./use-history"
import { usePreviewStore } from "./use-preview-store"
import { useWorkspace } from "./use-workspace"

/**
 * Non-subscribing read of the workspace the selection setters resolve against,
 * matching `useWorkspace()` (preview overlay when a preview session is active,
 * otherwise the committed workspace).
 */
function getSelectionWorkspace() {
  return usePreviewStore.getState().preview ?? getCurrentWorkspace()
}

/**
 * Non-subscribing read of the currently selected node or board, resolved against
 * the same preview-aware workspace `useSelection` uses. Use inside command and
 * action callbacks that need the live selection at call time but must not
 * re-render on every workspace edit.
 */
export function getCurrentSelection(): Variant | Instance | Board | null {
  const { selectedNodeId, selectedBoardId } = useStore.getState()
  const workspace = getSelectionWorkspace()
  const node = selectedNodeId ? getNode(workspace, selectedNodeId) : null
  if (node) return node
  return (
    (selectedBoardId ? getComponent(workspace, selectedBoardId) : null) ?? null
  )
}

/** Resource board kinds whose rows are selectable items (families, icons, media). */
export type ResourceItemKind = "font-collection" | "icon-set" | "media"

export type { ResourceEntryKind }

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
   * Whether the workspace itself is the selection (the objects-sidebar project
   * row). Mutually exclusive with every other selection field: setting it clears
   * the rest, and any other selection setter clears it. The canvas does not
   * change while it is set; `useActiveBoard` keeps rendering `frozenBoardKey`.
   */
  workspaceSelected: boolean
  /**
   * The board the canvas was showing when the workspace was selected. Held so
   * the canvas stays put while `workspaceSelected` is true, even though the
   * board and node selection are cleared. Null when no board was active.
   */
  frozenBoardKey: BoardKey | null
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
  selectNode: (
    id: VariantId | InstanceId | null,
    rootId?: string | null,
  ) => void
  selectResourceEntry: (kind: ResourceEntryKind, id: string | null) => void
  selectResourceItem: (key: string | null) => void
  selectWorkspace: (frozenBoardKey: BoardKey | null) => void
}

export const useStore = create<SelectionState>()((set) => ({
  selectedBoardId: null,
  selectedNodeId: null,
  selectedNodeRootId: null,
  selectedResourceEntry: null,
  selectedResourceItemKey: null,
  workspaceSelected: false,
  frozenBoardKey: null,
  selectBoard: (id: BoardKey | null) => {
    set({
      selectedBoardId: id,
      selectedNodeId: null,
      selectedNodeRootId: null,
      selectedResourceEntry: null,
      selectedResourceItemKey: null,
      workspaceSelected: false,
      frozenBoardKey: null,
    })
  },
  selectNode: (id: VariantId | InstanceId | null, rootId?: string | null) => {
    set({
      selectedNodeId: id,
      selectedNodeRootId: id ? (rootId ?? null) : null,
      selectedBoardId: null,
      selectedResourceEntry: null,
      selectedResourceItemKey: null,
      workspaceSelected: false,
      frozenBoardKey: null,
    })
  },
  selectResourceEntry: (kind: ResourceEntryKind, id: string | null) => {
    set({
      selectedResourceEntry: id ? { kind, id } : null,
      selectedNodeId: null,
      selectedNodeRootId: null,
      selectedBoardId: null,
      selectedResourceItemKey: null,
      workspaceSelected: false,
      frozenBoardKey: null,
    })
  },
  selectResourceItem: (key: string | null) => {
    set({
      selectedResourceItemKey: key,
      selectedNodeId: null,
      selectedNodeRootId: null,
      selectedBoardId: null,
      selectedResourceEntry: null,
      workspaceSelected: false,
      frozenBoardKey: null,
    })
  },
  selectWorkspace: (frozenBoardKey: BoardKey | null) => {
    set({
      workspaceSelected: true,
      frozenBoardKey,
      selectedNodeId: null,
      selectedNodeRootId: null,
      selectedBoardId: null,
      selectedResourceEntry: null,
      selectedResourceItemKey: null,
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

/**
 * Maps a board to the objects-sidebar section it belongs to. Component boards
 * resolve to their schema level; resource boards and playgrounds resolve to
 * their dedicated sections. Unknown rows return null so selection leaves
 * section expansion untouched.
 */
function resolveBoardSectionLevel(
  board: Board | undefined,
): ExpandableSection | null {
  if (!board) return null
  if (isComponentBoard(board) && isComponentId(board.catalogId)) {
    return getComponentSchema(board.catalogId).level
  }
  if (isThemeBoard(board)) return "THEME"
  if (isFontCollectionBoard(board)) return "FONT_COLLECTION"
  if (isIconSetBoard(board)) return "ICON_SET"
  if (isMediaBoard(board)) return "MEDIA"
  if (isPlaygroundBoard(board)) return "PLAYGROUND"
  return null
}

/**
 * Selection setters with their navigation side effects, decoupled from
 * workspace state subscription. The setters read the selection store and the
 * current workspace through `getState()` / `getCurrentWorkspace()` at call
 * time, so action-only consumers (objects rows, canvas, commands) do not
 * re-render on every workspace edit. Use this instead of `useSelection` when a
 * component only needs to change the selection, not read the selected object.
 */
export function useSelectionActions() {
  const { toggleSection } = useSectionExpansion()
  const { toggle: toggleObject, isExpanded } = useExpansion()
  const { autoExpandOnSelection } = useEditorConfig()

  const selectBoard = useStore((state) => state.selectBoard)
  const selectNode = useStore((state) => state.selectNode)
  const selectResourceEntry = useStore((state) => state.selectResourceEntry)
  const selectResourceItem = useStore((state) => state.selectResourceItem)
  const selectWorkspace = useStore((state) => state.selectWorkspace)

  const _selectBoard = useCallback(
    (id: BoardKey | null) => {
      if (id === useStore.getState().selectedBoardId) return

      selectBoard(id)
      if (id) {
        const workspace = getSelectionWorkspace()
        const board = workspace.boards[id]
        const sectionLevel = resolveBoardSectionLevel(board)

        // Expand the board's own section for navigation. Boards that map to no
        // section (unknown rows) leave section state untouched.
        if (sectionLevel) {
          toggleSection(sectionLevel, true)
        }

        // Auto-expand feature: expand board itself if enabled and board is collapsed
        // (This shows the board's variants, similar to how nodes expand to show children)
        if (autoExpandOnSelection && !isExpanded(id)) {
          toggleObject(id, true)
        }
      }
    },
    [
      selectBoard,
      toggleSection,
      toggleObject,
      autoExpandOnSelection,
      isExpanded,
    ],
  )

  const _selectNode = useCallback(
    (id: VariantId | InstanceId | null, rootId?: string | null) => {
      const { selectedNodeId, selectedNodeRootId } = useStore.getState()
      // Re-select when the same child id is clicked in a different variant-root
      // column so the selection moves to the clicked copy instead of sticking.
      if (id === selectedNodeId && (rootId ?? null) === selectedNodeRootId) {
        return
      }

      selectNode(id, rootId)
      if (id) {
        const workspace = getSelectionWorkspace()
        // Check if node exists in workspace (virtual category nodes won't exist)
        const node = getNode(workspace, id)

        if (!node) {
          return
        }

        // Check if node was collapsed before expanding ancestors
        const wasCollapsed = !isExpanded(id)

        // Always expand ancestors for navigation (this includes the node itself)
        toggleObject(id, true, { includeAncestors: true })
        const root = nodeRelationshipService.getRootVariant(node, workspace)
        const rootEntry = getNode(workspace, root.id)
        const rootCatalogId = rootEntry
          ? getNodeCatalogComponentId(rootEntry, workspace)
          : null
        if (rootCatalogId && isComponentId(rootCatalogId)) {
          const schema = getComponentSchema(rootCatalogId)
          toggleSection(schema.level, true)
        } else {
          const board = nodeRelationshipService.findBoardForNode(
            node,
            workspace,
          )
          if (board) {
            toggleSection(ComponentLevel.MODULE, true)
            toggleObject(getComponentKey(board), true, {
              includeAncestors: true,
            })
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
      selectNode,
      toggleObject,
      toggleSection,
      autoExpandOnSelection,
      isExpanded,
    ],
  )

  const _selectResourceEntry = useCallback(
    (kind: ResourceEntryKind, id: string | null) => {
      const selectedResourceEntry = useStore.getState().selectedResourceEntry
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
    [selectResourceEntry, toggleObject, autoExpandOnSelection],
  )

  const _selectResourceItem = useCallback(
    (key: string | null) => {
      if (key === useStore.getState().selectedResourceItemKey) return
      selectResourceItem(key)
    },
    [selectResourceItem],
  )

  const _selectWorkspace = useCallback(
    (frozenBoardKey: BoardKey | null) => {
      if (useStore.getState().workspaceSelected) return
      selectWorkspace(frozenBoardKey)
    },
    [selectWorkspace],
  )

  return {
    selectBoard: _selectBoard,
    selectNode: _selectNode,
    selectResourceEntry: _selectResourceEntry,
    selectResourceItem: _selectResourceItem,
    selectWorkspace: _selectWorkspace,
  }
}

export function useSelection() {
  const {
    selectBoard,
    selectNode,
    selectResourceEntry,
    selectResourceItem,
    selectWorkspace,
  } = useSelectionActions()

  const selectedBoardId = useStore((state) => state.selectedBoardId)
  const selectedNodeId = useStore((state) => state.selectedNodeId)
  const selectedResourceEntry = useStore((state) => state.selectedResourceEntry)
  const selectedResourceItemKey = useStore(
    (state) => state.selectedResourceItemKey,
  )
  const workspaceSelected = useStore((state) => state.workspaceSelected)
  const frozenBoardKey = useStore((state) => state.frozenBoardKey)
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

  return {
    selectBoard,
    selectNode,
    selectResourceEntry,
    selectResourceItem,
    selectWorkspace,
    selectedNodeId,
    selectedBoardId,
    selectedResourceEntry,
    selectedThemeEntryId,
    selectedFontCollectionEntryId,
    selectedIconSetEntryId,
    selectedMediaEntryId,
    selectedResourceItemKey,
    workspaceSelected,
    frozenBoardKey,
    selectedNode,
    selectedBoard,
    selectedId:
      selectedNodeId ?? selectedBoardId ?? selectedResourceEntry?.id ?? null,
    selection,
  }
}
