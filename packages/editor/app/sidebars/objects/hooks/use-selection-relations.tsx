import { createContext, useContext, useMemo, type ReactNode } from "react"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import { findComponentForNode } from "@lib/workspace/node-tree"
import { useSelectedNodeId } from "@lib/workspace/hooks/use-selection"
import { getComponentKey, getNode } from "@lib/workspace/workspace-accessors"
import { useWorkspace } from "@lib/workspace/hooks/use-workspace"

/**
 * Selection facts that are identical for every row in the objects tree.
 *
 * Computing these once in a provider keeps each row's render cheap: a row only
 * needs constant-time lookups (`selectedNodeId === id`, `Set.has(id)`) instead
 * of walking the workspace per row.
 */
interface SelectionRelations {
  selectedNodeId: string | null
  /** Immediate parent id of the selected node. */
  parentOfSelectedNodeId: string | null
  /** Ids of every ancestor of the selected node. */
  ancestorIdsOfSelected: Set<string>
  /** Component key of the board that contains the selected node. */
  selectedNodeBoardKey: string | null
}

const EMPTY_RELATIONS: SelectionRelations = {
  selectedNodeId: null,
  parentOfSelectedNodeId: null,
  ancestorIdsOfSelected: new Set(),
  selectedNodeBoardKey: null,
}

const SelectionRelationsContext =
  createContext<SelectionRelations>(EMPTY_RELATIONS)

export function SelectionRelationsProvider({
  children,
}: {
  children: ReactNode
}) {
  const { workspace } = useWorkspace({ usePreview: false })
  const selectedNodeId = useSelectedNodeId()

  const value = useMemo<SelectionRelations>(() => {
    if (!selectedNodeId) return EMPTY_RELATIONS

    const selectedNode = getNode(workspace, selectedNodeId)
    if (!selectedNode) {
      return { ...EMPTY_RELATIONS, selectedNodeId }
    }

    const ancestorIdsOfSelected = new Set<string>()
    let parent = workspaceService.findParentNode(selectedNodeId, workspace)
    const parentOfSelectedNodeId = parent?.id ?? null
    while (parent) {
      ancestorIdsOfSelected.add(parent.id)
      parent = workspaceService.findParentNode(parent.id, workspace)
    }

    const board = findComponentForNode(selectedNode, workspace)
    const selectedNodeBoardKey = board ? getComponentKey(board) : null

    return {
      selectedNodeId,
      parentOfSelectedNodeId,
      ancestorIdsOfSelected,
      selectedNodeBoardKey,
    }
  }, [workspace, selectedNodeId])

  return (
    <SelectionRelationsContext.Provider value={value}>
      {children}
    </SelectionRelationsContext.Provider>
  )
}

export function useSelectionRelations(): SelectionRelations {
  return useContext(SelectionRelationsContext)
}
