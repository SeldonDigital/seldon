import { type ReactNode, useEffect } from "react"
import { create } from "zustand"
import { nodeTraversalService } from "@seldon/core/workspace/services"
import type { Workspace } from "@seldon/core/workspace/types"
import { useSelectedNodeId } from "@app/workspace/hooks/use-selection"
import { useWorkspace } from "@app/workspace/hooks/use-workspace"
import { findComponentForNode } from "@lib/workspace/node-tree"
import { getComponentKey, getNode } from "@lib/workspace/workspace-accessors"

/**
 * Selection facts that are identical for every row in the objects tree.
 *
 * These live in a store, not React context, so each row subscribes to just the
 * boolean it needs (`is this node an ancestor?`, `is this the parent?`). On a
 * selection change only the rows whose answer flips re-render, instead of the
 * whole tree re-rendering off a single context value.
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

const useSelectionRelationsStore = create<SelectionRelations>(
  () => EMPTY_RELATIONS,
)

/** Structural equality so an unrelated edit leaves the store value untouched. */
function relationsEqual(a: SelectionRelations, b: SelectionRelations): boolean {
  if (
    a.selectedNodeId !== b.selectedNodeId ||
    a.parentOfSelectedNodeId !== b.parentOfSelectedNodeId ||
    a.selectedNodeBoardKey !== b.selectedNodeBoardKey ||
    a.ancestorIdsOfSelected.size !== b.ancestorIdsOfSelected.size
  ) {
    return false
  }
  for (const id of a.ancestorIdsOfSelected) {
    if (!b.ancestorIdsOfSelected.has(id)) return false
  }
  return true
}

/** Walks the selected node's ancestry into the flat relations record. */
function computeRelations(
  workspace: Workspace,
  selectedNodeId: string | null,
): SelectionRelations {
  if (!selectedNodeId) return EMPTY_RELATIONS

  const selectedNode = getNode(workspace, selectedNodeId)
  if (!selectedNode) return { ...EMPTY_RELATIONS, selectedNodeId }

  const ancestorIdsOfSelected = new Set<string>()
  let parent = nodeTraversalService.findParentNode(selectedNodeId, workspace)
  const parentOfSelectedNodeId = parent?.id ?? null
  while (parent) {
    ancestorIdsOfSelected.add(parent.id)
    parent = nodeTraversalService.findParentNode(parent.id, workspace)
  }

  const board = findComponentForNode(selectedNode, workspace)
  const selectedNodeBoardKey = board ? getComponentKey(board) : null

  return {
    selectedNodeId,
    parentOfSelectedNodeId,
    ancestorIdsOfSelected,
    selectedNodeBoardKey,
  }
}

/**
 * Computes the selection relations and publishes them to the store. Mounted once
 * around the objects tree. It re-renders on every edit because it reads the
 * workspace, but the store is updated only when the relations actually change,
 * so rows stay still on edits that do not move the selection.
 */
export function SelectionRelationsProvider({
  children,
}: {
  children: ReactNode
}) {
  const { workspace } = useWorkspace({ usePreview: false })
  const selectedNodeId = useSelectedNodeId()

  useEffect(() => {
    const next = computeRelations(workspace, selectedNodeId)
    if (!relationsEqual(useSelectionRelationsStore.getState(), next)) {
      useSelectionRelationsStore.setState(next, true)
    }
  }, [workspace, selectedNodeId])

  return <>{children}</>
}

/** Whether `nodeId` is an ancestor of the selected node. */
export function useIsAncestorOfSelection(nodeId: string): boolean {
  return useSelectionRelationsStore((state) =>
    state.ancestorIdsOfSelected.has(nodeId),
  )
}

/** Whether `nodeId` is the immediate parent of the selected node. */
export function useIsParentOfSelection(nodeId: string): boolean {
  return useSelectionRelationsStore(
    (state) => state.parentOfSelectedNodeId === nodeId,
  )
}

/** Whether the board `boardKey` contains the selected node. */
export function useIsBoardContainingSelection(boardKey: string): boolean {
  return useSelectionRelationsStore(
    (state) => state.selectedNodeBoardKey === boardKey,
  )
}
