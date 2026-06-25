import { useCallback } from "react"
import { create } from "zustand"
import { InstanceId, VariantId, Workspace } from "@seldon/core"
import {
  nodeTraversalService,
  typeCheckingService,
} from "@seldon/core/workspace/services"
import type { EntryNode } from "@seldon/core/workspace/types"
import { getCurrentWorkspace } from "@lib/workspace/hooks/use-history"
import { collectDescendantNodeIds } from "@lib/workspace/component-tree"
import { findComponentForNode } from "@lib/workspace/node-tree"
import { getComponentKey, getNode } from "@lib/workspace/workspace-accessors"

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
 * Reactive subscription to a single object's expansion state.
 *
 * Rows use this so toggling one subtree only re-renders the affected rows
 * instead of every consumer of the expansion store.
 */
export const useIsExpanded = (id: string): boolean =>
  useStore((state) => state.expandedObjects.has(id))

/**
 * Unified hook for expanding and collapsing objects in the objects panel.
 *
 * Subscribes only to the action functions, never to `expandedObjects`, so it
 * does not re-render its consumers on every toggle. Read reactive state through
 * `useIsExpanded`.
 */
export const useExpansion = () => {
  const expandObjects = useStore((state) => state.expandObjects)
  const collapseObjects = useStore((state) => state.collapseObjects)

  const toggle = useCallback(
    (
      id: string,
      shouldExpand?: boolean,
      options?: { includeAncestors?: boolean },
    ) => {
      const expand =
        shouldExpand ?? !useStore.getState().expandedObjects.has(id)

      if (!options?.includeAncestors) {
        if (expand) {
          expandObjects([id])
        } else {
          collapseObjects([id])
        }
      } else {
        const workspace = getCurrentWorkspace()
        const node = getNode(workspace, id as InstanceId | VariantId)
        const idsToToggle: string[] = []

        let currentNode: EntryNode | undefined = node

        while (currentNode) {
          idsToToggle.push(currentNode.id)

          if (typeCheckingService.isVariant(currentNode)) {
            const board = findComponentForNode(currentNode, workspace)
            if (board) {
              idsToToggle.push(getComponentKey(board))
            }
          }

          const parentNode = nodeTraversalService.findParentNode(
            currentNode.id,
            workspace,
          )
          if (!parentNode) break

          currentNode = parentNode as EntryNode
        }

        if (expand) {
          expandObjects(idsToToggle)
        } else {
          collapseObjects(idsToToggle)
        }
      }
    },
    [expandObjects, collapseObjects],
  )

  return {
    toggle,
    isExpanded: useCallback(
      (id: string) => useStore.getState().expandedObjects.has(id),
      [],
    ),
    expandObjects,
    collapseObjects,
    getAllDescendantNodeIds: useCallback(
      (nodeId: string) =>
        getAllDescendantNodeIds(nodeId, getCurrentWorkspace()),
      [],
    ),
  }
}
