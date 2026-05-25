import { useCallback } from "react"
import { create } from "zustand"
import { InstanceId, VariantId, Workspace } from "@seldon/core"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
import type { EntryNode } from "@seldon/core/workspace/types"
import { collectDescendantNodeIds } from "@lib/workspace/component-tree"
import { findComponentForNode } from "@lib/workspace/node-tree"
import { getComponentKey, getNode } from "@lib/workspace/workspace-accessors"
import { useWorkspace } from "@lib/workspace/use-workspace"

const useStore = create<{
  expandedObjects: Set<string>
  expandObjects: (ids: string[]) => void
  collapseObjects: (ids: string[]) => void
}>((set) => ({
  expandedObjects: new Set(),
  expandObjects: (ids) =>
    set((state) => {
      const newSet = new Set(state.expandedObjects)
      ids.forEach((id) => newSet.add(id))
      return { expandedObjects: newSet }
    }),
  collapseObjects: (ids) =>
    set((state) => {
      const newSet = new Set(state.expandedObjects)
      ids.forEach((id) => newSet.delete(id))
      return { expandedObjects: newSet }
    }),
}))

function getAllDescendantNodeIds(
  nodeId: string,
  workspace: Workspace,
): string[] {
  const node = getNode(workspace, nodeId)
  if (!node) return []

  const board = findComponentForNode(node, workspace)
  if (!board) return []

  return collectDescendantNodeIds(board, nodeId)
}

/**
 * Unified hook for expanding and collapsing objects in the objects panel.
 */
export const useExpansion = () => {
  const store = useStore()
  const { workspace } = useWorkspace({ usePreview: false })

  const toggle = useCallback(
    (
      id: string,
      shouldExpand?: boolean,
      options?: { includeAncestors?: boolean },
    ) => {
      const expand = shouldExpand ?? !store.expandedObjects.has(id)

      if (!options?.includeAncestors) {
        if (expand) {
          store.expandObjects([id])
        } else {
          store.collapseObjects([id])
        }
      } else {
        const node = getNode(workspace, id as InstanceId | VariantId)
        const idsToToggle: string[] = []

        let currentNode: EntryNode | undefined = node

        while (currentNode) {
          idsToToggle.push(currentNode.id)

          if (workspaceService.isVariant(currentNode)) {
            const board = findComponentForNode(currentNode, workspace)
            if (board) {
              idsToToggle.push(getComponentKey(board))
            }
          }

          const parentNode = workspaceService.findParentNode(
            currentNode.id,
            workspace,
          )
          if (!parentNode) break

          currentNode = parentNode as EntryNode
        }

        if (expand) {
          store.expandObjects(idsToToggle)
        } else {
          store.collapseObjects(idsToToggle)
        }
      }
    },
    [store, workspace],
  )

  return {
    toggle,
    isExpanded: (id: string) => store.expandedObjects.has(id),
    expandObjects: store.expandObjects,
    collapseObjects: store.collapseObjects,
    getAllDescendantNodeIds: useCallback(
      (nodeId: string) => getAllDescendantNodeIds(nodeId, workspace),
      [workspace],
    ),
  }
}
