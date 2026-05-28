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
import { useSectionExpansion } from "@components/sidebars/helpers/use-section-expansion"
import { useWorkspace } from "./use-workspace"

type SelectionState = {
  selectedBoardId: ComponentKey | null
  selectedNodeId: VariantId | InstanceId | null
  selectedThemeEntryId: string | null
  selectBoard: (id: ComponentKey | null) => void
  selectNode: (id: VariantId | InstanceId | null) => void
  selectThemeEntry: (id: string | null) => void
}

export const useStore = create<SelectionState>()((set) => ({
  selectedBoardId: null,
  selectedNodeId: null,
  selectedThemeEntryId: null,
  selectBoard: (id: ComponentKey | null) => {
    set({
      selectedBoardId: id,
      selectedNodeId: null,
      selectedThemeEntryId: null,
    })
  },
  selectNode: (id: VariantId | InstanceId | null) => {
    set({
      selectedNodeId: id,
      selectedBoardId: null,
      selectedThemeEntryId: null,
    })
  },
  selectThemeEntry: (id: string | null) => {
    set({
      selectedThemeEntryId: id,
      selectedNodeId: null,
      selectedBoardId: null,
    })
  },
}))

export function useSelection() {
  const { toggleSection } = useSectionExpansion()
  const { toggle: toggleObject, isExpanded } = useExpansion()
  const { autoExpandOnSelection } = useEditorConfig()

  const {
    selectBoard,
    selectNode,
    selectThemeEntry,
    selectedBoardId,
    selectedNodeId,
    selectedThemeEntryId,
  } = useStore()
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
      if (id) {
        toggleObject(id, true)
      }
    },
    [selectThemeEntry, selectedThemeEntryId, toggleObject],
  )

  return {
    selectBoard: _selectBoard,
    selectNode: _selectNode,
    selectThemeEntry: _selectThemeEntry,
    selectedNodeId,
    selectedBoardId,
    selectedThemeEntryId,
    selectedNode,
    selectedBoard,
    selectedId: selectedNodeId ?? selectedBoardId ?? selectedThemeEntryId,
    selection,
  }
}
