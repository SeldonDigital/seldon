import { useCallback } from "react"
import { create } from "zustand"
import { workspaceService } from "@seldon/core/workspace/services/workspace.service"
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

/**
 * This hook is used to expand and collapse nodes in the objects panel.
 */
export const useObjectExpansion = () => {
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
        const node = workspace.byId[id]
        const idsToToggle: string[] = []

        let currentNode = node

        // Collect all ancestors of the selected node including the board.
        while (currentNode) {
          idsToToggle.push(currentNode.id)

          // Include board
          if (workspaceService.isVariant(currentNode)) {
            const componentId = currentNode.component
            idsToToggle.push(componentId)
          }

          const parentNode = workspaceService.findParentNode(
            currentNode.id,
            workspace,
          )
          if (!parentNode) break

          currentNode = parentNode
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
    isObjectExpanded: (id: string) => store.expandedObjects.has(id),
  }
}
