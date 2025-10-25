import { useCallback } from "react"
import { create } from "zustand"
import { getComponentSchema } from "@seldon/core/components/catalog"
import { ComponentId } from "@seldon/core/components/constants"
import { InstanceId, VariantId } from "@seldon/core/index"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { useObjectExpansion } from "@components/objects-panel/hooks/use-object-expansion"
import { useSectionExpansion } from "@components/objects-panel/hooks/use-section-expansion"
import { useWorkspace } from "./use-workspace"

type SelectionState = {
  selectedBoardId: ComponentId | null
  selectedNodeId: VariantId | InstanceId | null
  selectBoard: (id: ComponentId | null) => void
  selectNode: (id: VariantId | InstanceId | null) => void
}

export const useStore = create<SelectionState>()((set) => ({
  selectedBoardId: null,
  selectedNodeId: null,
  selectBoard: (id: ComponentId | null) => {
    set({ selectedBoardId: id, selectedNodeId: null })
  },
  selectNode: (id: VariantId | InstanceId | null) => {
    set({ selectedNodeId: id, selectedBoardId: null })
  },
}))

export function useSelection() {
  const { toggleSection } = useSectionExpansion()
  const { toggle: toggleObject } = useObjectExpansion()

  const { selectBoard, selectNode, selectedBoardId, selectedNodeId } =
    useStore()
  const { workspace } = useWorkspace()

  const selectedNode = selectedNodeId ? workspace.byId[selectedNodeId] : null

  const selectedBoard = selectedBoardId
    ? workspace.boards[selectedBoardId]
    : null

  const selection = selectedNode ?? selectedBoard

  const _selectBoard = useCallback(
    (id: ComponentId | null) => {
      if (id === selectedBoardId) return

      selectBoard(id)
      if (id) toggleSection(getComponentSchema(id).level, true)
    },
    [selectBoard, selectedBoardId, toggleSection],
  )

  const _selectNode = useCallback(
    (id: VariantId | InstanceId | null) => {
      if (id === selectedNodeId) return

      selectNode(id)
      if (id) {
        toggleObject(id, true, { includeAncestors: true })
        const node = workspaceService.getNode(id, workspace)
        const root = workspaceService.getRootVariant(node, workspace)
        const schema = getComponentSchema(root.component)
        toggleSection(schema.level, true)
      }
    },
    [selectedNodeId, selectNode, toggleObject, workspace, toggleSection],
  )

  return {
    selectBoard: _selectBoard,
    selectNode: _selectNode,
    selectedNodeId,
    selectedBoardId,
    selectedNode,
    selectedBoard,
    selectedId: selectedNodeId ?? selectedBoardId,
    selection,
  }
}
